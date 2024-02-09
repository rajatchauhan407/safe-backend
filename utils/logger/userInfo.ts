import os from "os";

const userInfo = os.userInfo();

export default {user:userInfo.username};