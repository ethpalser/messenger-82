const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// expects { conversationId, otherUserId } in body (neither should be null)
router.put("/read", async (req, res, next) => {
    try{
        if (!req.user ){
            return res.sendStatus(401);
        }
        if (!req.body || !req.body.conversationId || !req.body.otherUserId ){
            return res.sendStatus(400);
        }
        const userId = req.user.id;
        const { conversationId, otherUserId } = req.body;

        const convoToUpdate = await Conversation.findConversation(userId, otherUserId);
        if(!convoToUpdate || convoToUpdate.id != conversationId){
            return res.sendStatus(403);
        }

        // update messages for the other user in the conversation as read
        await Message.update(
        {
            read: true
        },
        {
            where: {
                read: false,
                senderId: otherUserId,
                conversationId: conversationId
            }
        });

        // get the updated conversation to return, containing only the messages and conversations table info
        const convoFragment = await Conversation.findOne({
            where: { id: conversationId },
            order: [[Message, "createdAt", "ASC"]],
            include: [{ model: Message, order: ["createdAt", "DESC"] }, ],
        });
        // return the updated conversation and the user who made the update
        res.json({ conversationId: convoFragment.id, messages: convoFragment.messages });
    }
    catch (error) {
        next (error);
    }
});

module.exports = router;
