import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";

const code: Record<number, string> = {
  1: `// Steak.ts

class Steak {
  constructor(
    thickness: number, 
    temperature: number
  ) {
    this.thickness = thickness;
    this.temperature = temperature;
    this.crispy = false;
  }
}
  `,
  2: `// Steak.ts

class Steak {
  constructor(
    thickness: number, 
    temperature: number
  ) {
    this.thickness = thickness;
    this.temperature = temperature;
    this.crispy = false;
  }

  sousVide(temperature: number) {
    if (temperature > this.temperature) {
      this.temperature += 1;
    }
  }

  bake(temperature: number) {
    if (temperature > this.temperature) {
      this.temperature += 2;
    }
  }

  sear(temperature: number) {
    if (temperature > this.temperature) {
      this.temperature += 10;
    }
  }

}
  `,
  3: `// Steak.ts

class Steak {
  constructor(
    thickness: number, 
    temperature: number
  ) {
    this.thickness = thickness;
    this.temperature = temperature;
    this.externalMoisture = 80;
    this.crispiness = 0;
  }

  sousVide(temperature: number) {
    if (temperature > this.temperature) {
      this.temperature += 1;
    }
  }

  bake(temperature: number) {
    if (temperature > this.temperature) {
      this.temperature += 2;
    }
    this.externalMoisture -= 2;
  }

  sear(temperature: number) {
    if (temperature > this.temperature) {
      this.temperature += 10;
    }
    this.externalMoisture -= 15;
  }

}
  `,
};

const SteakCode = ({ config }: { config: number }) => {
  return (
    <CodeMirror
      className={config === 1 ? "large" : "small"}
      value={code[config] ?? `// no code defined for config ${config}`}
      width={`${Math.max(window.innerWidth / 2, 480)}px`}
      theme={dracula}
      extensions={[javascript({ jsx: true, typescript: true })]}
    />
  );
};
export default SteakCode;
