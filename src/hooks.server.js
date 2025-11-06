import cookie from "cookie";
import { redirect } from "@sveltejs/kit";
import { BASE_URL_API } from "$lib/api";

export async function handle({ event, resolve }) {
  const cookies = cookie.parse(event.request.headers.get("cookie") || "");
  let user = null;
  let abonnementExpire = false;

  if (cookies.auth) {
    try {
      const auth = JSON.parse(cookies.auth);
      user = {
        id: auth.id,
        role: auth.role,
        token: auth.token,
        username: auth.username,
        type: auth.type,
        status: auth.status,
        avatar: auth.avatar
      };

      if (!user?.role.includes("ROLE_ADMIN")) {
        // ✅ Vérification API abonnement
        const apiResponse = await fetch(
          BASE_URL_API + "/paiement/status/renouvellement/" + user?.id,
          {
            method: "GET"
            // headers: {
            //   Authorization: `Bearer ${auth.token}`,
            //   Accept: "application/json"
            // }
          }
        );

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          abonnementExpire = data.data.expire;
          console.error("Abonnement expiré:", abonnementExpire);
        } else {
          console.error("Erreur API abonnement:", await apiResponse.text());
        }
      } else {
        abonnementExpire = false;
      }
    } catch (e) {
      console.error("Erreur parsing ou appel API:", e);
    }
  }

  // ⛔ Pages protégées si abonnement expiré
  const protectedPagesWhenExpired = [
    // "/site/dossiers",
    // "/site/forum",
    // "/site/documents",
    // "/site/chatbox",
    // "/site/forum/all-forums",
    // "/site/faq",
    // "/site/alerte",
    // "/site/profil",
    "/site",
    "/dashboard/renouvellement",
    "/dashboard/alerts",
    "/dashboard/documentheque",
    "/dashboard/forum",
    "/dashboard/historique_payment",
    "/dashboard/mon_dossier",
    "/dashboard/oe_initie",
    "/dashboard/suivi_dossirt",
    "/dashboard/",



  ];

  if (
    user &&
    abonnementExpire &&
    protectedPagesWhenExpired.some((path) => event.url.pathname.startsWith(path))
  ) {
    return redirect(302, "/dashboard/renouvellement"); // ou une page de renouvellement
  }

  // ✅ Pages publiques accessibles sans login
  const publicPages = [
   
    "/inscription",
    "/inscription/etablissement",
    "/inscription/professionnel",
    "/",
    "/about",
    "/services",
    "/contact",
    "/connexion/forgot_password",
    "/connexion/forgot_password_admin",
    "/connexion",
    "/login"

  ];

  if (event.url.pathname.startsWith("/site") && !user) {
    const isPublic = publicPages.some((path) =>
      event.url.pathname.startsWith(path)
    );
    if (!isPublic) {
      return redirect(302, "/");
    }
  }

  // Redirections basées sur le rôle
  if (event.url.pathname.startsWith("/admin") && !user) {
    return redirect(302, "/login");
  }

  if (event.url.pathname === "/login" && user?.role.includes("ROLE_ADMIN")) {
    return redirect(302, "/admin");
  }

  if (event.url.pathname.startsWith("/site") && user?.role.includes("ROLE_ADMIN")) {
    return redirect(302, "/admin");
  }

  if (event.url.pathname.startsWith("/admin") && user?.role.includes("ROLE_MEMBRE")) {
    return redirect(302, "/dashboard");
  }

  // ✅ Attacher l’utilisateur dans locals
  event.locals.user = user;
  const response = await resolve(event);
  return response;
}
