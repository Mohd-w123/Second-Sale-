import Pincode from '../models/Pincode.js';

export const checkPincode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const service = (req.query.service || 'sell').toLowerCase().trim();
    const pincode = await Pincode.findOne({ code, isActive: true }).lean();

    if (!pincode) {
      return res.status(404).json({ message: 'Pincode not available', isServiceable: false });
    }

    // Default existing pincodes to sell:true, buy:true, repair:false for backward compatibility
    const services = {
      sell: pincode.services?.sell !== undefined ? Boolean(pincode.services.sell) : true,
      buy: pincode.services?.buy !== undefined ? Boolean(pincode.services.buy) : true,
      repair: Boolean(pincode.services?.repair),
    };

    const isServiceable = Boolean(services[service] ?? true);

    if (!isServiceable) {
      const serviceLabels = {
        repair: 'Doorstep repair service',
        sell: 'Doorstep device pickup',
        buy: 'Device delivery',
      };
      const label = serviceLabels[service] || 'This service';
      return res.status(404).json({
        message: `${label} is not available at this pincode yet.`,
        isServiceable: false,
        pincode: pincode.code,
        city: pincode.city,
        state: pincode.state,
        services,
      });
    }

    res.json({
      message: 'Pincode is serviceable',
      isServiceable: true,
      pincode: pincode.code,
      city: pincode.city,
      state: pincode.state,
      services,
    });
  } catch (error) {
    next(error);
  }
};
