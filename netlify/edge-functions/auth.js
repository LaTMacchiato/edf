export default async (request, context) => {
  // On demande à Netlify de sortir les clés de son coffre-fort
  const IDENTIFIANT = Netlify.env.get("DASHBOARD_USER");
  const MOT_DE_PASSE = Netlify.env.get("DASHBOARD_PASS");

  // Sécurité anti-bug : si vous avez oublié de configurer les clés sur Netlify
  if (!IDENTIFIANT || !MOT_DE_PASSE) {
    return new Response("Erreur de configuration du serveur : variables manquantes.", { status: 500 });
  }

  // On encode les identifiants au format attendu par les navigateurs (Base64)
  const identifiantsAttendus = btoa(`${IDENTIFIANT}:${MOT_DE_PASSE}`);
  const authHeader = request.headers.get('authorization');

  // Si le visiteur n'a pas fourni le bon sésame
  if (authHeader !== `Basic ${identifiantsAttendus}`) {
    return new Response("Accès refusé - Authentification requise", {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Tableau de bord RTE privé"',
      },
    });
  }

  // Si c'est le bon mot de passe, on laisse passer !
  return context.next();
};