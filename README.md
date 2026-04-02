npm install express mongoose cors dotenv jsonwebtoken bcryptjs cookie-parser multer cloudinary stripe zod mongoose-paginate-v2 validator nodemailer redis morgan

npm install -D typescript ts-node nodemon @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs @types/cookie-parser @types/multer @types/validator @types/nodemailer @types/morgan

npm install express-rate-limit
npm install -D @types/express-rate-limit


ecommerce-backend/
├─ src/
│  ├─ config/                # 3rd-party config
│  │  ├─ db.ts               # MongoDB connection
│  │  ├─ redis.ts            # Redis connection
│  │  ├─ cloudinary.ts       # Cloudinary setup
│  │  └─ env.ts              # dotenv
│  │
│  ├─ modules/               # 🔹 Modular features
│  │  ├─ auth/
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.routes.ts
│  │  │  ├─ auth.service.ts
│  │  │  └─ auth.validation.ts
│  │  │
│  │  ├─ user/
│  │  │  ├─ user.controller.ts
│  │  │  ├─ user.routes.ts
│  │  │  ├─ user.model.ts
│  │  │  └─ user.validation.ts
│  │  │
│  │  ├─ admin/
│  │  │  ├─ admin.controller.ts
│  │  │  ├─ admin.routes.ts
│  │  │  └─ admin.service.ts
│  │  │
│  │  ├─ seller/
│  │  │  ├─ seller.controller.ts
│  │  │  ├─ seller.routes.ts
│  │  │  └─ seller.service.ts
│  │  │
│  │  ├─ product/
│  │  │  ├─ product.controller.ts
│  │  │  ├─ product.routes.ts
│  │  │  ├─ product.model.ts
│  │  │  └─ product.validation.ts
│  │  │
│  │  ├─ cart/
│  │  │  ├─ cart.controller.ts
│  │  │  ├─ cart.routes.ts
│  │  │  └─ cart.model.ts
│  │  │
│  │  ├─ wishlist/
│  │  │  ├─ wishlist.controller.ts
│  │  │  ├─ wishlist.routes.ts
│  │  │  └─ wishlist.model.ts
│  │  │
│  │  ├─ order/
│  │  │  ├─ order.controller.ts
│  │  │  ├─ order.routes.ts
│  │  │  ├─ order.model.ts
│  │  │  └─ order.validation.ts
│  │  │
│  │  ├─ payment/
│  │  │  ├─ payment.controller.ts
│  │  │  ├─ payment.routes.ts
│  │  │  └─ payment.service.ts
│  │  │
│  │  └─ review/
│  │     ├─ review.controller.ts
│  │     ├─ review.routes.ts
│  │     ├─ review.model.ts
│  │     └─ review.validation.ts
│  │
│  ├─ middlewares/
│  │  ├─ auth.middleware.ts
│  │  ├─ error.middleware.ts
│  │  ├─ validate.middleware.ts
│  │  └─ rateLimit.middleware.ts
│  │
│  ├─ utils/
│  │  ├─ hashPassword.ts
│  │  ├─ comparePassword.ts
│  │  ├─ generateToken.ts
│  │  └─ pagination.ts
│  │
│  ├─ types/
│  │  └─ index.d.ts
│  │
│  ├─ app.ts
│  └─ server.ts
│
├─ package.json
├─ tsconfig.json
├─ .env
└─ README.md