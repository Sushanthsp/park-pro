import request from "./request";

// auth
export const login = (data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .post("/auth/login", data)
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
      .post("/auth/register", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};