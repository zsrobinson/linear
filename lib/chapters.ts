export type Chapter = {
  index: string;
  name: string;
  slug: string;
  children?: Chapter[];
};

export const chapters: Chapter[] = [
  {
    index: "1",
    name: "Systems of Linear Equations: Algebra",
    slug: "chap-algebra",
    children: [
      {
        index: "1.1",
        name: "Systems of Linear Equations",
        slug: "systems-of-eqns",
      },
      {
        index: "1.2",
        name: "Row Reduction",
        slug: "row-reduction",
      },
      {
        index: "1.3",
        name: "Parametric Form",
        slug: "parametric-form",
      },
    ],
  },
  {
    index: "2",
    name: "Systems of Linear Equations: Geometry",
    slug: "chap-geometry",
    children: [
      {
        index: "2.1",
        name: "Vectors",
        slug: "vectors",
      },
      {
        index: "2.2",
        name: "Vector Equations and Spans",
        slug: "spans",
      },
      {
        index: "2.3",
        name: "Matrix Equations",
        slug: "matrix-equations",
      },
      {
        index: "2.4",
        name: "Solution Sets",
        slug: "solution-sets",
      },
      {
        index: "2.5",
        name: "Linear Independence",
        slug: "linear-independence",
      },
      {
        index: "2.6",
        name: "Subspaces",
        slug: "subspaces",
      },
      {
        index: "2.7",
        name: "Basis and Dimension",
        slug: "dimension",
      },
      {
        index: "2.8",
        name: "Bases as Coordinate Systems",
        slug: "bases-as-coord-systems",
      },
      {
        index: "2.9",
        name: "The Rank Theorem",
        slug: "rank-thm",
      },
    ],
  },
  {
    index: "3",
    name: "Linear Transformations and Matrix Algebra",
    slug: "chap-matrices",
    children: [
      {
        index: "3.1",
        name: "Matrix Transformations",
        slug: "matrix-transformations",
      },
      {
        index: "3.2",
        name: "One-to-one and Onto Transformations",
        slug: "one-to-one-onto",
      },
      {
        index: "3.3",
        name: "Linear Transformations",
        slug: "linear-transformations",
      },
      {
        index: "3.4",
        name: "Matrix Multiplication",
        slug: "matrix-multiplication",
      },
      {
        index: "3.5",
        name: "Matrix Inverses",
        slug: "matrix-inverses",
      },
      {
        index: "3.6",
        name: "The Invertible Matrix Theorem",
        slug: "invertible-matrix-thm",
      },
    ],
  },
  {
    index: "4",
    name: "Determinants",
    slug: "chap-determinant",
    children: [
      {
        index: "4.1",
        name: "Determinants: Definition",
        slug: "determinants-definitions-properties",
      },
      {
        index: "4.2",
        name: "Cofactor Expansions",
        slug: "determinants-cofactors",
      },
      {
        index: "4.3",
        name: "Determinants and Volumes",
        slug: "determinants-volumes",
      },
    ],
  },
  {
    index: "5",
    name: "Eigenvalues and Eigenvectors",
    slug: "chap-eigenvalues",
    children: [
      {
        index: "5.1",
        name: "Eigenvalues and Eigenvectors",
        slug: "eigenvectors",
      },
      {
        index: "5.2",
        name: "The Characteristic Polynomial",
        slug: "characteristic-polynomial",
      },
      {
        index: "5.3",
        name: "Similarity",
        slug: "similarity",
      },
      {
        index: "5.4",
        name: "Diagonalization",
        slug: "diagonalization",
      },
      {
        index: "5.5",
        name: "Complex Eigenvalues",
        slug: "complex-eigenvalues",
      },
      {
        index: "5.6",
        name: "Stochastic Matrices",
        slug: "stochastic-matrices",
      },
    ],
  },
  {
    index: "6",
    name: "Orthogonality",
    slug: "chap-orthogonality",
    children: [
      {
        index: "6.1",
        name: "Dot Products and Orthogonality",
        slug: "dot-product",
      },
      {
        index: "6.2",
        name: "Orthogonal Complements",
        slug: "orthogonal-complements",
      },
      {
        index: "6.3",
        name: "Orthogonal Projection",
        slug: "projections",
      },
      {
        index: "6.4",
        name: "Orthogonal Sets",
        slug: "orthogonal-sets",
      },
      {
        index: "6.5",
        name: "The Method of Least Squares",
        slug: "least-squares",
      },
    ],
  },
];

/** Returns a link to the ILA textbook given a chapter index. */
export function textbookLink(slug: string) {
  return `https://textbooks.math.gatech.edu/ila/${slug}.html`;
}

/** Returns a {@link Chapter} object given a chapter index. */
export function getChapter(index: string) {
  const chapter = chapters
    .flatMap((c) => [c, ...(c.children ?? [])])
    .find((c) => c.index === index);

  if (!chapter) throw new Error("Couldn't find chapter index.");
  return chapter;
}
