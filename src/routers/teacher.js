const express = require("express");
const Teacher = require("../models/teacher")
const router = new express.Router();

router.post("/users", async (req, res) => {
  const teacher = new Teacher(req.body);

  try {
    await teacher.save();
    res.send(200);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// router.post("/users/login", async (req, res) => {
//   try {
//     const user = await User.findByCredentials(
//       req.body.email,
//       req.body.password
//     );
//     const token = await user.generateAuthToken();

//     res.send({ user, token });
//   } catch (error) {
//     res.status(400).send();
//   }
// });

// router.post("/users/logout", auth, async (req, res) => {
//   console.log(req);
//   try {
//     req.user.tokens = req.user.tokens.filter((token) => {
//       return token.token !== req.token;
//     });
//     await req.user.save();
//     res.status(200).send(req.user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// router.post("/users/logoutAll", auth, async (req, res) => {
//   try {
//     req.user.tokens = [];
//     await req.user.save();
//     res.send();
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// router.get("/users/me", auth, async (req, res) => {
//   res.send(req.user);
// });

// router.patch("/users/me", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   try {
//     const user = req.user;

//     updates.forEach((update) => (user[update] = req.body[update]));

//     await user.save();

//     if (!user) {
//       return res.status(404).send();
//     }

//     res.send(user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// router.delete("/users/me", async (req, res) => {
//   try {
//     await req.user.remove();
//     res.send(req.user);
//   } catch (error) {
//     res.status(500).send();
//   }
// });

// router.get("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send("User not found!");
//     }
//     res.send(user);
//   } catch (error) {
//     res.status(500).send("Server error!");
//   }
// });

module.exports = router;
