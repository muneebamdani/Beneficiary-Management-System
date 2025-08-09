const Beneficiary = require('../models/Beneficiary');

exports.create = async (req, res) => {
  const { cnic, name, phone, address, purpose } = req.body;

  const exists = await Beneficiary.findOne({ cnic });
  if (exists) return res.status(400).json({ success: false, message: 'CNIC already exists' });

  const beneficiary = new Beneficiary({ cnic, name, phone, address, purpose, createdBy: req.user._id });
  await beneficiary.save();

  res.status(201).json({ success: true, data: beneficiary });
};

exports.getAll = async (req, res) => {
  const { tokenID, cnic, page = 1, limit = 20 } = req.query;

  // Build query based on available filters
  const query = {};
  if (tokenID) {
    query.tokenID = tokenID;
  } else if (cnic) {
    query.cnic = cnic;
  }

  const beneficiaries = await Beneficiary.find(query)
    .populate('createdBy', 'name role')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Beneficiary.countDocuments(query);

  res.json({ success: true, data: { beneficiaries, total, page: +page } });
};

exports.update = async (req, res) => {
  const { status, remarks } = req.body;
  const update = { ...(status && { status }), ...(remarks !== undefined && { remarks }) };

  const beneficiary = await Beneficiary.findByIdAndUpdate(req.params.id, update, { new: true })
    .populate('createdBy', 'name role');

  if (!beneficiary) return res.status(404).json({ success: false, message: 'Not found' });

  res.json({ success: true, data: beneficiary });
};
