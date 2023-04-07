import request from "./request";

// auth
export const login = (data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .post("/user/login", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
export const register = (data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .post("/user/register", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const verifyOtp = (data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .post("/user/verify-otp", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const bookSlot = (data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .post("/user/book/bookslot", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const getSlots = (params) => {
  console.log("params",params)
  return new Promise(async (resolve, reject) => {
    await request
      .get("/user/book/bookslot", {params})
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const deleteSlots = (id) => {
  return new Promise(async (resolve, reject) => {
    await request
      .delete("/user/book/bookslot/"+id)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};