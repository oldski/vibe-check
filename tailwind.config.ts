import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        happy: {
          50: '#FFF7DC',
          100: '#FFEFBA',
          200: '#FFE797',
          300: '#FFE073',
          400: '#FFD84B',
          500: '#FFD100',
          600: '#D0AB12',
          700: '#A38617',
          800: '#786317',
          900: '#504215',
          950: '#2B230F'
        },
        chill: {
          50: '#D9FFF4',
          100: '#B3FFE9',
          200: '#8CFFDE',
          300: '#66F3D2',
          400: '#40E0C2',
          500: '#00C49A',
          600: '#009C7D',
          700: '#007760',
          800: '#005343',
          900: '#003227',
          950: '#001912'
        },optimistic: {
          50: '#E5F6FE',
          100: '#C8ECFD',
          200: '#ABE1FB',
          300: '#8ED7FA',
          400: '#6FCBF5',
          500: '#4FC3F7',
          600: '#3D9FCF',
          700: '#2E7CA5',
          800: '#20597A',
          900: '#123651',
          950: '#091A29'
        },loved: {
          50: '#FFE6EA',
          100: '#FFCCD3',
          200: '#FFB3BD',
          300: '#FF99A7',
          400: '#FF8092',
          500: '#FF4C61',
          600: '#D83D58',
          700: '#B22F4C',
          800: '#8B223D',
          900: '#66172D',
          950: '#3E0D1B'
        },
        appreciative: {
          50: '#FFF0E0',
          100: '#FFE1C2',
          200: '#FFD3A3',
          300: '#FFC584',
          400: '#FFB663',
          500: '#FFB74D',
          600: '#D6953E',
          700: '#AD7430',
          800: '#855424',
          900: '#5D3718',
          950: '#36200D'
        },
        
        motivated: {
          50: '#D5F6FB',
          100: '#ACE9F2',
          200: '#85DDE8',
          300: '#60D1DF',
          400: '#3CC4D5',
          500: '#00ACC1',
          600: '#00899C',
          700: '#006778',
          800: '#004754',
          900: '#002833',
          950: '#001316'
        },
        reflective: {
          50: '#EFE8F8',
          100: '#DFD1F1',
          200: '#CEBAEA',
          300: '#BDA3E3',
          400: '#AD8DDA',
          500: '#7E57C2',
          600: '#6747A2',
          700: '#523983',
          800: '#3D2B64',
          900: '#291E45',
          950: '#161227'
        },
        melancholy: {
          50: '#F1F3F3',
          100: '#E4E6E8',
          200: '#D7DADC',
          300: '#CACED1',
          400: '#BDC2C5',
          500: '#B0B6BA',
          600: '#909598',
          700: '#727578',
          800: '#545759',
          900: '#393B3C',
          950: '#1F2021'
        },
        lonely: {
          50: '#F3EDFF',
          100: '#E8DBFF',
          200: '#DDC9FF',
          300: '#D2B8FF',
          400: '#C7A6FF',
          500: '#C7B9FF',
          600: '#A48FCC',
          700: '#8273A3',
          800: '#62587A',
          900: '#433C52',
          950: '#27212F'
        },
        anxious: {
          50: '#FFF2E0',
          100: '#FFE4C2',
          200: '#FFD5A3',
          300: '#FFC783',
          400: '#FFB961',
          500: '#FFA500',
          600: '#D18500',
          700: '#A56700',
          800: '#794A00',
          900: '#4D2E00',
          950: '#271800'
        },
        overwhelmed: {
          50: '#FBE8E9',
          100: '#F7D1D3',
          200: '#F4BBBB',
          300: '#EEA4A5',
          400: '#E98D90',
          500: '#D95D63',
          600: '#B94B55',
          700: '#983D48',
          800: '#782F38',
          900: '#58222A',
          950: '#341416'
        },
        angry: {
          50: '#FBE4E4',
          100: '#F7C9C9',
          200: '#F1AEAE',
          300: '#EB9393',
          400: '#E57979',
          500: '#D32F2F',
          600: '#AC2626',
          700: '#861E1E',
          800: '#601616',
          900: '#3B0E0E',
          950: '#1B0505'
        },
        tired: {
          50: '#F4F4F4',
          100: '#E9E9E9',
          200: '#DEDEDE',
          300: '#D3D3D3',
          400: '#C8C8C8',
          500: '#C0C0C0',
          600: '#989898',
          700: '#727272',
          800: '#4D4D4D',
          900: '#2A2A2A',
          950: '#141414'
        },
        inspired: {
          50: '#D5FDFF',
          100: '#ADFBFF',
          200: '#86F4FF',
          300: '#60E9F5',
          400: '#3EDDEE',
          500: '#00E5FF',
          600: '#00B8CC',
          700: '#0091A3',
          800: '#006B79',
          900: '#004551',
          950: '#002229'
        },
        playful: {
          50: '#FFE7E5',
          100: '#FFCFCC',
          200: '#FFB7B3',
          300: '#FF9F9B',
          400: '#FF8783',
          500: '#FF8A80',
          600: '#D86E66',
          700: '#B15451',
          800: '#8A3D3E',
          900: '#63282B',
          950: '#3A1618'
        },
        brat: {
          50: '#EEF7DB',
          100: '#DDEFB7',
          200: '#CAE794',
          300: '#B7DF6F',
          400: '#A1D647',
          500: '#8ACE00',
          600: '#72A810',
          700: '#5C8415',
          800: '#466216',
          900: '#304114',
          950: '#1C230E'
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    {
      pattern: /(bg|text|ring|hover|focus|active|placeholder|border|border-b|outline)-(happy|angry|brat|chill|reflective|appreciative|playful|anxious|overwhelmed|tired|lonely|loved|melancholy|motivated|optimistic|inspired)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover', 'focus', 'active', 'dark'],
    },
    'ring',
    'ring-0',
    'ring-1',
    'ring-2',
    'ring-4',
    'ring-8',
  ],
} satisfies Config;

export default config;
