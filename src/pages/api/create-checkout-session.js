const stripe = require("stripe")("sk_test_51Ko9jPJG12VEnZfi4FQh6LNAaSwynItVwqWHr5egvbLgtYJAdAx2ZRXPaF1UpfFmTl6ZXQFBb7jLqUjoSQMkIPPq00HUcwOPvA");

export default async (req, res) => {
  const { items, email } = req.body;

  const transformedItems = items.map((item) => ({
    description: item.description,
    quantity: 1,
    price_data: {
      currency: "cop",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image],
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_rates: ["shr_1LvyLGJG12VEnZfiWWkScUjf"],
    shipping_address_collection: {
      allowed_countries: ["GB", "US", "CA", "CO", "AR"],
    },
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.HOST} /success`,
    cancel_url: `${process.env.HOST} /checkout`,
    metadata: {
      email: email,
      images: JSON.stringify(items.map((item) => item.image)),
    },
    currency: "cop"
  });

  res.status(200).json({ id: session.id });
};
