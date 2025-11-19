import api from "./api";

export async function getUser() {
    const response = await api.get("/user");
    if(response.status === 200) {
        if(response.user.avatar) {
            const avatar = await api.get(`/images/${response.user.avatar}`, { responseType: "blob" });
            return { ...response.user, avatar: URL.createObjectURL(avatar) }
        } else {
            return response.user
        }
    } else {
        return null;
    }
}