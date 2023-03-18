import jwt from "jsonwebtoken";
export default (rule = "nobody") => {//nobody

    return (req, res, next) => {

        const token = (req.headers.authorization || "").replace(/Bearer\s?/, "")


        if (token) {
            try {

                const decoded = jwt.verify(token, "purrweb")


                req.userId = decoded._id;
                req.userRule = decoded.rule;

                switch (rule) {
                    case "nobody":
                        if (req.userRule === "admin" || req.userRule === "creator" || req.userRule === "nobody") {
                            next()
                            break;
                        }

                    case "creator":
                        if (req.userRule === "admin" || req.userRule === "creator") {
                            next()
                            break;
                        }

                    case "admin":
                        if (req.userRule === "admin") {
                            next()
                            break;
                        }
                    default:
                        res.status(403).json({
                            message: `Нужно иметь доступ ${rule} и выше`
                        })
                        break;
                }


            } catch (err) {
                return res.status(403).json({
                    message: "Нет доступа"
                })
            }
        } else {
            return res.status(403).json({
                message: "Нет доступа"
            })
        }


    }
}