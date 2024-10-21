interface InfoLdg {
  title: string;
  description: string;
  image: string;
  list: Array<{ title: string; description: string; icon: string }>;
}

interface FeatureLdg {
  title: string;
  description: string;
  link: string;
  icon: string;
}

interface TestimonialType {
  name: string;
  job: string;
  image: string;
  review: string;
}

export const infos: InfoLdg[] = [
  {
    title: "Empower Your Creativity",
    description:
      "Unlock the fun and potential of your headshots with HeadShots.fun. Transform simple snapshots into captivating AI-enhanced images that reflect your true self.",
    image: "/_static/illustrations/work-from-home.jpg",
    list: [
      {
        title: "Create Effortlessly",
        description: "Enjoy a seamless and intuitive process that makes creating the perfect headshot a breeze.",
        icon: "laptop",
      },
      {
        title: "Personalize with AI",
        description: "Use advanced AI tools to customize every aspect of your headshot, ensuring it’s uniquely you.",
        icon: "settings",
      },
      {
        title: "Elevate Your Presence",
        description: "Whether for work or play, make sure your online presence stands out with headshots that combine fun with professionalism.",
        icon: "search",
      },
    ],
  }
];

export const features: FeatureLdg[] = [
  {
    title: "Effortless Customization",
    description:
      "Tailor your AI-generated headshots to fit your unique style. Our intuitive tools make it easy to adjust every detail.",
    link: "/",
    icon: "sliders", 
  },
  {
    title: "Instant Results",
    description:
      "Generate stunning headshots in seconds. With the power of AI, you'll never have to wait for professional-quality images.",
    link: "/",
    icon: "zap", 
  },
  {
    title: "Seamless Integration",
    description:
      "Easily incorporate your headshots into your personal or professional profiles, with formats optimized for any platform.",
    link: "/",
    icon: "share2", 
  },
  {
    title: "Secure and Private",
    description:
      "Your data is safe with us. We prioritize your privacy and ensure that your headshots are securely stored and shared.",
    link: "/",
    icon: "shield", 
  },
  {
    title: "AI-Enhanced Creativity",
    description:
      "Leverage the power of AI to explore creative possibilities. Experiment with different styles and looks effortlessly.",
    link: "/",
    icon: "cpu", 
  },
  {
    title: "Fun and Engaging",
    description:
      "Enjoy a playful and engaging experience as you create headshots that are both fun and professional.",
    link: "/",
    icon: "smile", 
  },
];

export const testimonials: TestimonialType[] = [
  {
    name: "Sarah Green",
    job: "Portrait Photographer",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    review:
    "HeadShots.fun has completely transformed my workflow. The AI tools are not only efficient but also fun to use, making the headshot creation process both professional and enjoyable.",
  },
  {
    name: "Laura Bennett",
    job: "Digital Marketing Specialist",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
    review:
      "HeadShots.fun made it super easy to create professional headshots for all my social media campaigns. ",
  },
  {
    name: "Michael Carter",
    job: "Brand Strategist",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    review:
      "HeadShots.fun has significantly enhanced my brand work by providing professional-quality images that perfectly align with my brand's style.",
  },
  {
    name: "Olivia Turner",
    job: "Startup Founder",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    review:
      "Creating headshots for my startup has never been this easy and enjoyable. HeadShots.fun delivers fantastic results while keeping the process light and fun.",
  },
  {
    name: "David Harris",
    job: "Creative Director",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    review:
      "I love how HeadShots.fun balances creativity and professionalism. The flexibility of the AI tools allows me to design headshots that are both fun and perfectly suited to my creative projects.",
  },
  {
    name: "Chris Wilson",
    job: "Full-Stack Developer",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    review:
      "The efficiency and quality of HeadShots.fun are outstanding. I was able to create studio-quality headshots in minutes, and the process was surprisingly enjoyable.",
  },
  {
    name: "Emma Collins",
    job: "Marketing Coordinator",
    image: "https://randomuser.me/api/portraits/women/16.jpg",
    review:
      "HeadShots.fun has been a valuable tool for our marketing campaigns. The AI-generated headshots are not only professional but also have a unique, fun element that makes our profiles stand out.",
  },
  {
    name: "John Doe",
    job: "CEO",
    image: "https://randomuser.me/api/portraits/men/17.jpg",
    review:
      "The quality and speed of HeadShots.fun are impressive. I was able to create a professional headshot that looks like it was done in a studio, all within minutes.",
  },
];
