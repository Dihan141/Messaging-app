import axios from "axios"
const backendUrl = import.meta.env.VITE_BACKEND_URL

export const acceptUser = async(currUserInfo, chatUserId) => {
    try {
        const response = await axios.post(`${backendUrl}/api/connections/accept`, 
            { otherUid: chatUserId },
            {
                headers: {
                    Authorization: `Bearer ${currUserInfo.user.token}`
                }
            }
        )

        if(response.data.success){
            console.log('Message request accepted')
        }
    } catch (error) {
        alert(error)
    }
}