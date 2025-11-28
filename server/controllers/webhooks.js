import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkwebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    const { type, data } = req.body;

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          name: data.first_name + " " + data.last_name,
          email: data.email_addresses[0].email_address,
          image: data.image_url,
          resume: ''
        };
        await User.create(userData);
        return res.json({ success: true, message: 'User created' });
      }

      case 'user.updated': {
        const userData = {
          name: data.first_name + " " + data.last_name,
          email: data.email_addresses[0].email_address,
          image: data.image_url
        };
        await User.findByIdAndUpdate(data.id, userData);
        return res.json({ success: true, message: 'User updated' });
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        return res.json({ success: true, message: 'User deleted' });
      }

      default:
        return res.json({ message: 'Unhandled event type' });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ success: false, message: 'Webhooks Error' });
  }
};
