import { nanoid } from 'nanoid';
import Link from '../models/LinkSchema.js';
import Click from '../models/ClickSchema.js';
import {UAParser} from 'ua-parser-js';
import dotenv from 'dotenv';

dotenv.config({
    path:'./.env'
});

// Create a new short link
export const createLink = async (req, res) => {
  try {
    const { originalUrl, remarks, expiresAt } = req.body;
    const shortCode = nanoid(8);

    const link = new Link({
      originalUrl,
      shortCode,
      remarks,
      expiresAt: expiresAt || null,
      userId: req.userId
    });

    await link.save();
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all links for a user
export const getLinks = async (req, res) => {
  const { page = 1, limit = 8 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const links = await Link.find({ userId: req.userId })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalLinks = await Link.countDocuments({ userId: req.userId });

    res.json({
      links,
      currentPage: page,
      totalPages: Math.ceil(totalLinks / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get a single link
export const getLink = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.userId });
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update link status (active/inactive)
export const updateLinkStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive },
      { new: true }
    );
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Edit a link
export const editLink = async (req, res) => {
  try {
    const { originalUrl, remarks, expiresAt } = req.body;
    const link = await 
    Link.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { originalUrl, remarks, expiresAt },
      { new: true }
    );
    res.json(link);
    }
    catch (error) {
    res.status(500).json({ error: error.message });
    }
}

// Delete a link
export const deleteLink = async (req, res) => {
  try {
    await Link.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Redirect and track clicks
export const redirectAndTrackClicks = async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.shortCode });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    if (!link.isActive || (link.expiresAt && new Date() > link.expiresAt)) {
      return res.status(410).json({ error: 'Link is inactive or expired' });
    }

    // Parse user agent
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();
    let device = 'Desktop';
    
    if (result.device.type === 'mobile') device = 'Mobile';
    else if (result.device.type === 'tablet') device = 'Tablet';

    // Record click
    const click = new Click({
      linkId: link._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      device
    });
    await click.save();

    // Update click count
    await Link.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } });

    res.redirect(link.originalUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics for a specific link
export const getLinkAnalytics = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Get clicks by date
    const clicksByDate = await Click.aggregate([
      { $match: { linkId: link._id } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": -1 } }
    ]);

    // Get clicks by device
    const clicksByDevice = await Click.aggregate([
      { $match: { linkId: link._id } },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalClicks: link.clicks,
      clicksByDate,
      clicksByDevice
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
