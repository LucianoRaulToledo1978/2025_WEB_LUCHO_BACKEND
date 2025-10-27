import mongoose from "mongoose";


const WorkspaceSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        url_image:{
            type:String,
            
        },
        modified_at:{
            type:Date,
            default: null
        },
        created_at:{
            type: Date,
            default:Date.now
        },
        active:{
            type:Boolean,
            default: true
        },
        userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        }


})

const Workspaces = mongoose.model('Workspace', WorkspaceSchema)

export default Workspaces
