export const observer = {
  promise: Promise.resolve(),
  init() {
    const observer = this;
    this.promise = new Promise((res) => {
      observer.resolve = res;
      setTimeout(res, 5000);
    });
  },
  resolve: () => {},
};
