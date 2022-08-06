const cloudinary = require('cloudinary');


exports.uploadProcess = async (req,res,next) => {

    const uploads = (file,folder) => {
        return new Promise(resolve=> {
            cloudinary.uploader.upload(file,(result)=>{
                resolve({
                    url: result.url,
                    id: result.public_id
                },{
                    resource_type:'auto',
                    folder
                })//end resolve
            })//end cloudinary
        })//end new Promise
    };//end func uploads

    const uploader = async (path) => uploads(path,'docs');

    if(req.method === "POST"){
        const urls = [];
        const files = req.files;//imagenes que suba con mi middelware de cloydinary siempre y cuando mande un uploader.single() uploader.array()
        console.log("mis Files",req.body)
        if(!req.file){
            for(const file of files){ //for of array string --- for in Objects
                const { path } = file;
                const newPath = await uploader(path)
                urls.push({newPath, name:file.originalname })
            }

            res.status(200).json({result:urls, msg:"Imagenes subidas correctamente"})

        }else{
            const { path } = req.file;
            const newPath = await uploader(path)

            res.status(200).json({result:{newPath,name:req.file.originalname}, msg:"Imagen subida correctamente"})

        }


    }else{
        res.status(405).json({errorMessage:`${req.method} method not allowed`})
    }

}