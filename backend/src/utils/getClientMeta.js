const getClientMeta = (req) => {
  return {
    ip: req.ip,
    // userAgent: req.headers["user-agent"],
  };
};

export default getClientMeta;
