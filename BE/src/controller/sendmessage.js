const sendMesssage = async (req,res)=>{
    try {
        const {name,email,message} = req.body

        
    } catch (error) {
        console.log("Error in send message controller", error.message);
        res.status(500).json({
            error: "Intrenal Server Error"
        })
    }
}

export default sendMesssage