import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";


export default defineConfig({

    plugins: [
        react()
    ],


    server: {

        host: "0.0.0.0",

        port: 5173,

        strictPort: true,


        // =====================================
        // HTTPS
        // =====================================

        https: {

            key: fs.readFileSync(
                path.resolve(
                    "certs/server.key"
                )
            ),

            cert: fs.readFileSync(
                path.resolve(
                    "certs/server.crt"
                )
            )

        },


        // =====================================
        // PROXY
        // =====================================

        proxy: {

            "/api": {

                target:
                    "https://127.0.0.1:3000",

                changeOrigin: true,

                secure: false

            },


            "/uploads": {

                target:
                    "https://127.0.0.1:3000",

                changeOrigin: true,

                secure: false

            }

        }

    }

});