import Users from "./User.model.js";

class UserRepository {

    static async createUser(name, email, password) {
        const new_user = await Users.create({
            name: name,
            email: email,
            password: password,
            verified_email: false,
            created_at: new Date()
        });

        return new_user;
    }

    static async getAll() {
        const users = await Users.find();
        return users;
    }

    static async getById(user_id) {
        const user_found = await Users.findById(user_id);
        return user_found;
    }

    static async deleteById(user_id) {
        await Users.findByIdAndDelete(user_id);
        return true;
    }

    static async updateById(user_id, new_values) {
        const updated = await Users.findByIdAndUpdate(
            user_id,
            new_values,
            { new: true }
        );
        return updated;
    }

    static async getByEmail(email) {
        const user = await Users.findOne({ email: email });
        return user;
    }
}

export default UserRepository;
