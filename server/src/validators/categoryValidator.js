export const validateCreateCategory = (
    req,
    res,
    next,
) => {
    const { name } = req.body;
    if (!name?.trim()) {
        return res.status(400).json({ message: "Category name is required" })
    }
    next();
}
