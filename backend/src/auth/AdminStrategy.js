import { Strategy } from "passport-strategy";

export default class AdminStrategy extends Strategy {
    constructor() {
        super();
        this.name = "admin";
    }

    async authenticate(req, options) {
        const { username, password } = req.body;

        if(!username || !password) return this.fail({ message: "Fields must be filled" }, 422);

        if(
            username != process.env.ADMIN_USERNAME && 
            password != process.env.ADMIN_PASSWORD
        ) return this.fail({ message: "Invalid credentials" }, 401);

        return this.success({ username })
    }
}