import multer from "multer";


export default (dir) => {

    // const toggler = (dir) => {

    //     dir === "file" && 

    // }




    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/' + dir);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "." + file.originalname.split(".").slice(-1));
        }
    })


    const fileFilter = (req, file, cb) => {


        if (dir === "img") {
            if (file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg") {
                cb(null, true);
            }
        }
        if (dir === "file") {
            if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                file.mimetype === "application/pdf" ||
                file.mimetype === "application/vnd.oasis.opendocument.text") {
                cb(null, true);
            }
        }

        cb(null, false);
    }


    const upload = multer({ storage, fileFilter }).single(dir)

    return upload
}
