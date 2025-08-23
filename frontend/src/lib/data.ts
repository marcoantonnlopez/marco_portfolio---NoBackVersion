// import prisma from "./prisma";

// export async function getLeaderProjects() {
//   const projects = await prisma.proyecto.findMany({
//     where: {
//       liderazgo: {
//         // esto asegura que solo incluimos proyectos con liderazgo existente
//         not: null,
//       },
//     },
//     include: {
//       liderazgo: true,
//     },
//   });

//   return projects.map((p) => ({
//     id: p.id.toString(),
//     title: p.titulo, // ajusta según tu campo
//     description: p.descripcion,
//     imageUrl: p.imagenUrl ?? "/fallback.jpg",
//     logoUrl: p.logoUrl ?? "/logo.svg",
//     members: p.liderazgo?.numMiembros ?? 0,
//     hackathons: p.liderazgo?.numHackathons ?? 0,
//     awards: p.liderazgo?.numPremios ?? 0,
//   }));
// }
