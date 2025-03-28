import express from "express";
import User from "../models/user.js";

const router = express.Router();

// GET
// http:localhost:3000/users/:userId/applications/
router.get("/", async (req, res) => {
    try {
        const user = await User.findById(req.session.user);

        res.render("applications/index.ejs", {
            user: req.session.user,
            applications: user.applications,
        });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

router.get("/new", (req, res) => {
    try {
        res.render("applications/new", { user: req.session.user });
    } catch (error) {
        console.error(error);
        // TODO create an error template and render
    }
});

router.get("/:applicationId/edit", async (req, res) => {
    try {
        const { applicationId } = req.params;
        const user = await User.findById(req.session.user);
        const application = user.applications.find((app) => {
            return app._id.toString() === applicationId;
        });

        res.render("applications/edit", {
            user: req.session.user,
            application: application,
        });
    } catch (error) {
        console.error(error);
        // TODO create an error template and render
    }
});

router.get("/:applicationId", async (req, res) => {
    try {
        const { applicationId } = req.params;
        const user = await User.findById(req.session.user._id);
        const application = user.applications.find((app) => {
            return app._id.toString() === applicationId;
        });

        res.render("applications/show", {
            user: req.session.user,
            application: application,
        });
    } catch (error) {
        console.error(error);
        // TODO create an error template and render
    }
});

// POST
router.post("/", async (req, res) => {
    try {
        const { company, title, notes, postingLink, status } = req.body;

        // We create an application on the user and push it to the db
        const user = await User.findById(req.session.user._id);

        user.applications.push({
            company,
            title,
            notes,
            postingLink,
            status,
        });

        await user.save();
        // Redirect the user to the /users/userId/applications
        res.redirect(`/users/${req.session.user._id}/applications`);
    } catch (error) {
        console.error(error);
        res.send("There was an error creating the applicaiton.");
        // TODO create an error template and render
    }
});

// PUT
router.put("/:applicationId", async (req, res) => {
    try {
        // get the app id
        const { applicationId } = req.params;
        const { company, title, notes, postingLink, status } = req.body;
        // find the application via id
        const user = await User.findById(req.session.user._id);
        let application = user.applications.id(applicationId);
        application.set({
            company,
            title,
            notes,
            postingLink,
            status,
        });

        await user.save();
        // redirect the peeps to the right place
        res.redirect(`/users/${req.session.user._id}/applications`);
    } catch (error) {
        console.error(error);
        // TODO create an error template and render
    }
});

// DELETE
router.delete("/:applicationId", async (req, res) => {
    try {
        const { applicationId } = req.params;
        const user = await User.findById(req.session.user._id);

        // Option 1
        user.applications.forEach((app, index) => {
            if (app._id.toString() === applicationId) {
                user.applications.splice(index, 1);
            }
        });

        // Option 2
        // user.applications.id(applicationId).deleteOne();

        await user.save();

        res.redirect(`/users/${req.session.user._id}/applications`);
    } catch (error) {
        console.error(error);
        // TODO create an error template and render
    }
});

export default router;
