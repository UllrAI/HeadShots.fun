export const categories = [
    { name: 'All', id: 'all' },
    { name: 'Creative', id: 'creative' },
    { name: 'Studio', id: 'studio' },
];

export const styles = [
    {
        name: "Pro 1 (Dark Bg)",
        img: "pro1-darkbg.jpeg",
        prompt: "business headshot of {prompt}, dark background, in a suit, portrait photo,dark background, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "flaws in the eyes, flaws in the face, flaws, lowres, non-HDRi, low quality, worst quality,artifacts noise, text, watermark, glitch, deformed, mutated, ugly, disfigured, hands, low resolution, partially rendered objects,  deformed or partially rendered eyes, deformed, deformed eyeballs, cross-eyed,blurry,border, picture frame",
        category: "studio",
        hot: true
    },
    {
        name: "Comics",
        img: "comics.jpeg",
        prompt: "color comic of {prompt}, graphic illustration, comic art, headshot, graphic novel art, vibrant, highly detailed",
        negative_prompt: "photograph, deformed, glitch, noisy, realistic, stock photo,border, picture frame",
        category: "creative"
    },
    {
        name: "Line Art",
        img: "line-art.jpeg",
        prompt: "line art drawing of {prompt}, portrait, sleek, modern, minimalist, graphic, line art, vector graphics",
        negative_prompt: "anime, photorealistic, 35mm film, deformed, glitch, blurry, noisy, off- center, deformed, cross - eyed, closed eyes, bad anatomy, ugly, disfigured, mutated, realism, realistic, impressionism, expressionism, oil, acrylic,border, picture frame",
        category: "creative"
    },
    {
        name: "Watercolor",
        img: "watercolor.jpeg",
        prompt: "Watercolor painting of {prompt} ,portrait,Vibrant, beautiful, painterly, detailed, textural, artistic",
        negative_prompt: "anime, photorealistic, 35mm film, deformed, glitch, low contrast, noisy,border, picture frame,",
        category: "creative",
        isNew: true
    },
    {
        name: "ID Photo",
        img: "id-photo.jpeg",
        prompt: "ID Photo of {prompt}, professional, clean background, headshot portrait photo, white background, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "",
        category: "studio"
    },
    {
        name: "Impressionism",
        img: "impressionism.jpeg",
        prompt: "Portrait, impressionist painting of {prompt}, loose brushwork, vibrant color, light and shadow play, headshot, artistic",
        negative_prompt: "",
        category: "creative",
        hot: true
    },
    {
        name: "Clay",
        img: "clay.jpeg",
        prompt: "claymotion, made-of-clay, stopmotion, polymer clay, ultra light clay, {prompt}, High quality, details, cartoonish, 8k",
        negative_prompt: "",
        category: "creative",
    },
    {
        name: "Pro 2 (Light Bg)",
        img: "pro2-lightbg.jpeg",
        prompt: "business headshot of {prompt}, White background, in a suit, portrait photo,White background , Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "",
        category: "studio",
        isNew: true
    },
    {
        name: "Astronaut",
        img: "astronaut.jpeg",
        prompt: "Portrait of {prompt} as an astronaut, futuristic,  ultra  highly detailed,realistic, concept art, intricate textures, interstellar background, space travel, art by alphonse mucha, ryan kittleson, greg rutkowski, leesha hannigan, stephan martiniere, stanley artgerm lau",
        negative_prompt: "",
        category: "creative",
    },
    {
        name: "Cyberpunk",
        img: "cyberpunk.jpeg",
        prompt: "cyberpunk style of {prompt} , vibes, vibrant,Neon lights, stunningly beautiful, crisp, detailed, sleek, ultramodern, highlights,  shadows, high contrast, cinematic, ultra detailed, intricate, professional",
        negative_prompt: "painting, drawing, illustration, glitch, deformed, mutated, cross-eyed, ugly, disfigured",
        category: "creative",
        isNew: true
    },
    {
        name: "Popmart 3D",
        img: "popmart.jpeg",
        prompt: "Solo, popmart Blind Box Adorable 3D Character, {prompt}, solo, beautiful, detailed, 3D render, adorable character, 3D art",
        negative_prompt: "ugly, deformed, noisy, blurry, low contrast, grunge, sloppy, unkempt, photograph, photo, realistic, border, picture frame, text, watermark",
        category: "creative",
        isNew: true
    },
    {
        name: "Cafe",
        img: "cafe.jpeg",
        prompt: "headshot of {prompt}, leisure Informal clothing, in cafe background, cafe background, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "",
        category: "studio",
    },
    {
        name: "Viking",
        img: "viking.jpeg",
        prompt:"Closeup portrait painting of {prompt} as a viking, ultra realistic, concept art, intricate details, powerful and fierce, highly detailed, photorealistic, octane render, 8 k, unreal engine. art by artgerm and greg rutkowski and charlie bowater and magali villeneuve and alphonse mucha, golden hour, horns and braids in hair, fur-lined cape and helmet, axe in hand, looking towards the camera",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Paladin",
        img: "paladin.jpeg",
        prompt: "Closeup portrait of {prompt} as a paladin, wearing brilliant white armor and a crown, fantasy concept art, artstation trending, highly detailed, beautiful landscape in the background, art by wlop, greg rutkowski, thierry doizon, charlie bowater, alphonse mucha, golden hour lighting, ultra realistic",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Hobbit",
        img: "hobbit.jpeg",
        prompt: "Closeup portrait of {prompt} as a Hobbit, small, big brown eyes, green and brown clothing, detailed facial features, small feet, wispy hair, fantasy concept art, artstation trending, highly detailed, art by John Howe, Alan Lee, and Weta Workshop, earthy colors, looking into camera",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Jedi",
        img: "jedi.jpeg",
        prompt: "Closeup portrait of {prompt} as a jedi with a lightsaber, highly detailed, science fiction, star wars concept art, intricate details, bright colors, golden hour, art by marko djurdjevic, greg rutkowski, wlop, fredperry, digital painting, rossdraws",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Harry Potter",
        img: "harry-potter.jpeg",
        prompt:"Closeup portrait of {prompt} as a Harry Potter character, magical world, wands, robes, Hogwarts castle in the background, enchanted forest, detailed lighting, art by jim kay, charlie bowater, alphonse mucha, ronald brenzell, digital painting, concept art",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Elf",
        img: "elf.jpeg",
        prompt:"Closeup portrait of {prompt} as an elf with long blond hair, fantasy concept art, intricate details, detailed armor, majestic background, art by wlop, Greg Rutkowski, digital painting, smooth lighting, looking towards the viewer",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Clown",
        img: "clown.jpeg",
        prompt:"Closeup portrait of {prompt} as a clown, highly detailed, surreal, expressionless face, bright colors, contrast lighting, abstract background, art by wlop, greg rutkowski, charlie bowater, magali villeneuve, alphonse mucha, cartoonish, comic book style",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Wizard",
        img: "wizard.jpeg",
        prompt:"Closeup portrait of {prompt} as a wizard, highly detailed {prompt}, fantasy concept art, intricate details and textures, magical, colorful, art by wlop, greg rutkowski, charlie bowater, magali villeneuve, alphonse mucha, surreal, {prompt} looking into the distance, holding a staff, fire and stars in the background",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Samurai",
        img: "samurai.jpeg",
        prompt:"Closeup portrait of {prompt} as a samurai warrior, war-torn landscape in the background, wearing a black and red armor, ready to fight, detailed textures, concept art, noir art, art by hinata matsumura, alphonse mucha, mike mignola, kazu kibuishi, and rev.matsuoka, digital painting, ultra-realistic",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Ninja",
        img: "ninja.jpeg",
        prompt:"Closeup portrait of {prompt} as a ninja, wearing a black hood and suit, stealthy movements, dark night background, shadows and mist, detailed and realistic, art by kazuya yamashita, yuya kanzaki, yang zhizhuo, digital painting, photorealism, 8k resolution",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Pirate",
        img: "pirate.jpeg",
        prompt:"Closeup portrait of {prompt} as a pirate, wild and crazy, bandana, eye patch, golden hoop earrings, tattered and ripped clothes, detailed tattoos, rough and rugged, art by alphonse mucha, kai carpenter, ignacio fernandez rios, charlie bowater, noir photorealism, ultra real",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Superhero",
        img: "superhero.jpeg",
        prompt:"Closeup portrait of {prompt} as a superhero, dynamic lighting, intense colors, detailed costume, artstation trending, art by alphonse mucha, greg rutkowski, ross tran, leesha hannigan, ignacio fernandez rios, kai carpenter, noir photorealism, film",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Knight",
        img: "knight.jpeg",
        prompt:"Closeup portrait of {prompt} as a knight, wearing a full suit of armor, intricate details, majestic and powerful, bright shining silver armor, matching blue cape, a golden crown, artstation trending, highly detailed, digital painting, art by wlop, greg rutkowski, and charlie bowater",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Cyborg",
        img: "cyborg.jpeg",
        prompt:"Closeup portrait of {prompt} as a cyborg, mechanical parts, ultra realistic, concept art, intricate details, eerie, highly detailed, photorealistic, 8k, unreal engine. art by artgerm and greg rutkowski and charlie bowater and magali villeneuve and alphonse mucha, golden hour, cyberpunk, robotic, steampunk, neon colors, metallic textures",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Monster",
        img: "monster.jpeg",
        prompt:"Closeup portrait of {prompt} as monster, with glowing eyes and sharp teeth, dark shadows, foggy background, highly detailed, photorealism, concept art, digital painting, art by yahoo kim, max grecke, james white, viktor hulík, fabrizio bortolussi",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Vampire",
        img: "vampire.jpeg",
        prompt:"Closeup portrait of {prompt} as a vampire, pale skin, dark eyes, sharp fangs, detailed shadows and highlights, eerie atmosphere, mystical and magical, art by leesha hannigan, thierry doizon, alphonse mucha, kai carpenter, noir photorealism, surreal and dreamlike, deep red hues",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Zombie",
        img: "zombie.jpeg",
        prompt:"Closeup portrait of {prompt} as a zombie, decaying skin and clothing, dark and eerie, highly detailed, photorealistic, 8k, ultra realistic, horror style, art by greg rutkowski, charlie bowater, and magali villeneuve",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Witch",
        img: "witch.jpeg",
        prompt:"Closeup portrait of {prompt} as a witch, surrounded by magical elements, highly detailed, photorealism, digital painting, dark colors, grayscale, intricate details, art by yuumei, greg rutkowski, eddie hong, and charlie bowater, ultra realism, magical elements",
        negative_prompt: "",
        category: "creative"
    },
    {
        name: "Office",
        img: "office.jpeg",
        prompt: "business headshot of {prompt}, in the office, office background, in a suit, portrait photo,IT office, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera ",
        negative_prompt: "",
        category: "studio"
    },
    {
        name: "Park",
        img: "park.jpeg",
        prompt: "headshot of {prompt}, park background, in a suit, portrait photo,park background, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "",
        category: "studio",
        hot: true
    },
    {
        name: "Real Estate",
        img: "real-estate.jpeg",
        prompt: "headshot of {prompt} as Real Estate Agent, outdoor house background, in a suit, house background, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "",
        category: "studio"
    },
    {
        name: "Bookshelf",
        img: "bookshelf.jpeg",
        prompt: "headshot of {prompt}, bookshelf background,bookshelf background, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "",
        category: "studio",
        hot: true
    },
    {
        name: "Yacht",
        img: "yacht.jpeg",
        prompt: "headshot of {prompt}, Leisure Informal clothing, with a Yacht background,Yacht background, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "",
        category: "studio"
    },
    {
        name: "Theater",
        img: "theater.jpeg",
        prompt: "headshot of {prompt}, Leisure Informal clothing, in a Theater background,Theater background, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "",
        category: "studio",
        isNew: true
    },
    {
        name: "Summer Luxe",
        img: "summer-luxe.jpeg",
        prompt: "headshot of {prompt}, leisure Informal clothing, in a Summer Luxe seaside background, seaside background, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "",
        category: "studio",
    },
    {
        name: "B&W",
        img: "b-w.jpeg",
        prompt: "b&w business headshot of {prompt},only Black and white colors, in a suit, portrait photo, Half-body digital photo , realistic, highly detailed, photorealistic, 8k, looking towards the camera",
        negative_prompt: "",
        category: "studio"
    },
];

export const domainPath = "https://s.headshots.fun/options-img";