//old code

router.post("/transferProductMain", (req, res) => {
    const { store_from, store_to, product_id, product_name,imgSrc_1, imgSrc_2, imgSrc_3, imgSrc_4, des, product_price, variation_id, transfer_qty, date } = req.body;
    db.query("SELECT * FROM variation WHERE product_id=? AND variation_id=?", [product_id, variation_id], (err, result) => {
      const cqty = result[0].remaining_qty;
      if (cqty < transfer_qty) {
        res.json({ 'message': "wrong qty value" });
      } else {
        db.query("INSERT INTO transfer_product SET ?", { store_from, store_to, product_id, product_name, product_price, variation_id, transfer_qty, date, status: "" }, (err, result) => {
          if (err) {
            res.json({ 'message': err });
          } else {
            var uqty = cqty - transfer_qty;
            db.query("UPDATE variation SET ? WHERE variation_id = ?", [{ remaining_qty: uqty }, variation_id], (err, result) => {
              if (err) {
                res.json({ 'message': err });
              } else {
                db.query("INSERT INTO store_stock SET ?", { store_id: store_to, product_id, variation_id, product_name,imgSrc_1, imgSrc_2, imgSrc_3, imgSrc_4, des, product_qty: transfer_qty, product_price, status: "" }, (err, result) => {
                  if (err) {
                    res.json({ 'message': err });
                  } else {
  
                    res.json({ 'message': true });
                  }
                })
                //    res.json({'message':true});
              }
            })
          }
        })
      }
    })
  })





  
//multi variation transfer
router.post("/transferProductMain", (req, res) => {
    const { store_from, store_to, product_id, product_name, product_price, imgSrc_1, imgSrc_2, imgSrc_3, imgSrc_4, des, date, variations } = req.body;
       const parsedVariations = JSON.parse(variations);
    let errorOccurred = false;
    //   res.json({ 'message': parsedVariations })
    // Loop through each variation and process the transfer
    parsedVariations.forEach(({ variationId, quantity }) => {
        db.query("SELECT * FROM variation WHERE product_id=? AND variation_id=?", [product_id, variationId], (err, result) => {
            if (err || result.length === 0) {
                errorOccurred = true;
                // Handle the error as needed (e.g., log it or return an error response)
            } else {
                const cqty = result[0].remaining_qty;
                if (cqty < quantity) {
                    errorOccurred = true;
                    // Handle the error where quantity is greater than available quantity
                } else {
                    db.query("INSERT INTO transfer_product SET ?", { store_from, store_to, product_id, product_name, product_price, variation_id: variationId, transfer_qty: quantity, date, status: "" }, (err, result) => {
                        if (err) {
                            errorOccurred = true;
                            // Handle the error during transfer_product insertion
                        } else {
                            const uqty = cqty - quantity;
                            db.query("UPDATE variation SET ? WHERE variation_id = ?", [{ remaining_qty: uqty }, variationId], (err, result) => {
                                if (err) {
                                    errorOccurred = true;
                                    // Handle the error during variation update
                                } else {
                                    db.query("INSERT INTO store_stock SET ?", { store_id: store_to, product_id, variation_id: variationId, product_name, product_qty: quantity, product_price, imgSrc_1, imgSrc_2, imgSrc_3, imgSrc_4, des, status: "" }, (err, result) => {
                                        if (err) {
                                            errorOccurred = true;
                                            // Handle the error during store_stock insertion
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    // After processing all variations, send the appropriate response
    if (errorOccurred) {
        res.json({ message: "Error occurred during transfer" });
    } else {
        res.json({ message: "Product(s) Transferred" });
    }
});
