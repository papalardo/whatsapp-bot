export const PaginationMiddleware = (req, res, next) => {
    req.pagination = (options = {}) => ({
        perPage: 50,
        currentPage: parseInt(req.query.page) || 1,
        ...options,
    });

    next();
}

export default PaginationMiddleware;