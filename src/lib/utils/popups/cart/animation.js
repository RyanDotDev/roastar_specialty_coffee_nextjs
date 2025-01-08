const cartAnimate = {
    hidden: {
        x: "100vh",
        opacity: 0,
      },
      visible: {
        x: "0",
        opacity: 1,
        transition: {
          duration: 0.1,
          type: "spring",
          damping: 45,
          stiffness: 500,
        },
      },
      exit: {
        x: "100vh",
        opacity: 0,
      },
}

export { cartAnimate }