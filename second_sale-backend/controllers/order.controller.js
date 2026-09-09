import Order from "../models/Order.js";
import TvLead from "../models/TvLead.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

const mapTvStatusToOrderStatus = (status) => {
  switch (status) {
    case "pickup_scheduled": return "scheduled";
    case "quote_sent": return "scheduled";
    case "completed": return "completed";
    case "cancelled": return "cancelled";
    case "contacted": return "placed";
    default: return "placed";
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { device, priceBreakdown, pickup } = req.body;

    const order = await Order.create({
      userId: req.user.id,
      device,
      priceBreakdown,
      pickup,
      status: "placed",
      partnerName: "Rajesh Kumar",
      partnerPhone: "+91 98765 43210",
    });

    res.status(201).json({
      orderId: order.orderId,
      message: "Order created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    // 1. Fetch standard orders
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Also fetch TV Trade-in Leads for this user
    const user = await User.findById(req.user.id).select("phone email");
    const userPhone = user?.phone;

    const tvQuery = {
      $or: [
        { userId: req.user.id },
        ...(userPhone ? [{ "customer.phone": userPhone }] : []),
      ],
    };

    const tvLeads = await TvLead.find(tvQuery).sort({ createdAt: -1 }).lean();

    // Deduplicate by orderId / leadId
    const existingOrderIds = new Set(orders.map(o => o.orderId));

    for (const lead of tvLeads) {
      if (!existingOrderIds.has(lead.leadId)) {
        orders.push({
          _id: lead._id,
          orderId: lead.leadId,
          userId: req.user.id,
          createdAt: lead.createdAt,
          updatedAt: lead.updatedAt,
          status: mapTvStatusToOrderStatus(lead.status),
          leadStatus: lead.status, // raw TV status
          device: {
            category: "tv",
            brand: lead.brand,
            modelName: `${lead.brand} ${lead.screenSize} TV`,
            slug: "tv",
            screenSize: lead.screenSize,
            tvType: lead.tvType,
            screenCondition: lead.condition,
            bodyCondition: lead.condition,
            functionalIssues: lead.additionalNotes ? [lead.additionalNotes] : [],
            accessories: "Remote & Power Cable",
            imageUrl: lead.photos?.front || "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&auto=format&fit=crop&q=80",
          },
          priceBreakdown: {
            basePrice: lead.offeredPrice || 0,
            finalPrice: lead.offeredPrice || 0,
          },
          pickup: {
            name: lead.customer?.name || "",
            phone: lead.customer?.phone || "",
            city: lead.customer?.city || "",
            pincode: lead.customer?.pincode || "",
            address: lead.customer?.address || "",
            timeSlot: "Flexible Callback",
            date: lead.createdAt,
          },
          partnerName: "TV Inspection Team",
          partnerPhone: "+91 98765 43210",
        });
      }
    }

    // Sort all combined orders newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    let order = await Order.findOne({ orderId }).lean();

    if (!order) {
      // Check if it is a TV Lead
      const lead = await TvLead.findOne({ leadId: orderId }).lean();
      if (!lead) {
        return res.status(404).json({ message: "Order not found" });
      }

      const user = await User.findById(req.user.id).select("phone");
      const isOwner = (lead.userId && lead.userId.toString() === req.user.id) ||
                      (user && user.phone === lead.customer?.phone);
      if (!isOwner) {
        return res.status(403).json({ message: "Access denied" });
      }

      order = {
        _id: lead._id,
        orderId: lead.leadId,
        userId: req.user.id,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        status: mapTvStatusToOrderStatus(lead.status),
        leadStatus: lead.status,
        device: {
          category: "tv",
          brand: lead.brand,
          modelName: `${lead.brand} ${lead.screenSize} TV`,
          slug: "tv",
          screenSize: lead.screenSize,
          tvType: lead.tvType,
          screenCondition: lead.condition,
          bodyCondition: lead.condition,
          functionalIssues: lead.additionalNotes ? [lead.additionalNotes] : [],
          accessories: "Remote & Power Cable",
          imageUrl: lead.photos?.front || "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&auto=format&fit=crop&q=80",
        },
        priceBreakdown: {
          basePrice: lead.offeredPrice || 0,
          finalPrice: lead.offeredPrice || 0,
        },
        pickup: {
          name: lead.customer?.name || "",
          phone: lead.customer?.phone || "",
          city: lead.customer?.city || "",
          pincode: lead.customer?.pincode || "",
          address: lead.customer?.address || "",
          timeSlot: "Flexible Callback",
          date: lead.createdAt,
        },
        partnerName: "TV Inspection Team",
        partnerPhone: "+91 98765 43210",
      };
    } else if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      // Check TvLead
      const lead = await TvLead.findOne({ leadId: orderId });
      if (!lead) return res.status(404).json({ message: "Order not found" });

      const user = await User.findById(req.user.id).select("phone");
      const isOwner = (lead.userId && lead.userId.toString() === req.user.id) ||
                      (user && user.phone === lead.customer?.phone);
      if (!isOwner) return res.status(403).json({ message: "Access denied" });

      lead.status = "cancelled";
      await lead.save();
      return res.json({ message: "TV order cancelled successfully", orderId: lead.leadId });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!["placed", "scheduled"].includes(order.status)) {
      return res.status(400).json({ message: 'Order can only be cancelled when status is placed or scheduled' });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", orderId: order.orderId });
  } catch (error) {
    next(error);
  }
};

export const rescheduleOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { date, timeSlot } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    order.pickup.date = date;
    order.pickup.timeSlot = timeSlot;
    order.status = "scheduled";
    await order.save();

    res.json({ message: "Order rescheduled successfully", orderId: order.orderId });
  } catch (error) {
    next(error);
  }
};

export const updateOrderPaymentMethod = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    order.pickup.paymentMethod = paymentMethod;
    await order.save();

    res.json({ message: "Payment method updated successfully", orderId: order.orderId });
  } catch (error) {
    next(error);
  }
};
