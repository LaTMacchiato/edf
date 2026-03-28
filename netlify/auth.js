export default async (request, context) => {
  // Définissez ici vos identifiants d'accès
  const IDENTIFIANT = "com"
  const MOT_DE_PASSE = "equipepenly";

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