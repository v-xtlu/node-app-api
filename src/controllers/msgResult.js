class MsgResult {
  constructor(status,  data) {
      this.status = status;
      this.data = data;
  }
  
  toJson () {
    return JSON.stringify({status: this.status, message: this.data })
  }
}

module.exports = MsgResult