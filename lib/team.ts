export type TeamMember = {
  name: string;
  role: string;
  university: string;
  department: string;
  email: string;
  linkedin: string;
};

export const team: TeamMember[] = [
  {
    name: "Taha Yunus Demir",
    role: "Engineering",
    university: "Kütahya Dumlupınar University",
    department: "Computer Engineering",
    email: "tahayunusdemir@gmail.com",
    linkedin: "https://www.linkedin.com/in/taha-yunus-demir",
  },
  {
    name: "Alpaslan Kemal Pehlivanlı",
    role: "Product & Strategy",
    university: "Middle East Technical University",
    department: "Industrial Engineering",
    email: "alpkemalpehlivanli@gmail.com",
    linkedin: "https://www.linkedin.com/in/alpaslankemal",
  },
  {
    name: "Fırat Pala",
    role: "Design",
    university: "İstanbul Arel University",
    department: "Graphic Design",
    email: "piratfala@gmail.com",
    linkedin: "https://www.linkedin.com/in/fırat-pala-431a9226a",
  },
];
