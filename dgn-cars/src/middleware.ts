import { withAuth } from "next-auth/middleware";

export default withAuth({ pages: { signIn: "/admin/connexion" } });

// Tout /admin sauf la page de connexion.
export const config = { matcher: ["/admin", "/admin/((?!connexion).*)"] };
