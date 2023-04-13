import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveNatural } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { GridRows, GridColumns } from "@visx/grid";
import { Group } from "@visx/group";
import { PatternLines } from "@visx/pattern";
import { scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { ParentSize } from "@visx/responsive";
import { useRef, useState } from "react";
import { BsFire } from "react-icons/bs";
import { TbRulerMeasure } from "react-icons/tb";
import { AnimatedAxis, AnimatedGridRows } from "@visx/react-spring";

// enum Method {
//   Grill = "grill",
//   SousVide = "sous-vide",
//   Oven = "oven",
// }

const TemperatureGraph = () => {
  // const [method, setMethod] = useState(Method.Grill);
  const [temperature, setTemperature] = useState(500);
  const [thickness, setThickness] = useState(0.75);

  const timeWindowInMinutes =
    7.5 / getTemperatureChangeSlope(thickness, temperature);

  // convert time to seconds if it's less than 2 minutes
  let timeWindow = (
    timeWindowInMinutes < 2 ? timeWindowInMinutes * 60 : timeWindowInMinutes
  ).toFixed(0);
  if (temperature < 130) timeWindow = "Infinite";
  const timeUnit = timeWindowInMinutes < 2 ? "seconds" : "minutes";

  return (
    <Grid gridTemplateColumns={["1fr", "1fr", "2fr 5fr"]} w="full" h="full">
      <Box w="full" py={14} px={8} borderRight="1px solid #373737">
        <VStack spacing={12}>
          {/* <FormControl>
            <FormLabel color="white">Method</FormLabel>
            <Select
              value={method}
              placeholder="Select method"
              onChange={(e) => setMethod(e.target.value as Method)}
              color="white"
            >
              <option value={Method.Grill}>Grill/Pan</option>
              <option value={Method.SousVide}>Sous Vide</option>
              <option value={Method.Oven}>Oven</option>
            </Select>
          </FormControl> */}
          <FormControl>
            <FormLabel color="white">Temperature (°F)</FormLabel>
            <Heading color="white">{`${temperature} °F`}</Heading>
            <Slider
              id="slider"
              defaultValue={temperature}
              min={75}
              max={700}
              step={25}
              onChange={(v) => setTemperature(v)}
            >
              <SliderMark value={100} mt={3} ml={-2.5} color="white">
                100
              </SliderMark>
              <SliderMark value={300} mt={3} ml={-2.5} color="white">
                300
              </SliderMark>
              <SliderMark value={500} mt={3} ml={-2.5} color="white">
                500
              </SliderMark>
              <SliderTrack bg="red.100">
                <SliderFilledTrack bg="tomato" />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="tomato" as={BsFire} />
              </SliderThumb>
            </Slider>
          </FormControl>
          <FormControl>
            <FormLabel color="white">Thickness (inches)</FormLabel>
            <Heading color="white">{`${thickness}"`}</Heading>
            <Slider
              id="slider"
              defaultValue={thickness}
              min={0.5}
              max={3}
              step={0.25}
              onChange={(v) => setThickness(v)}
            >
              <SliderMark value={0.75} mt={3} ml={-2.5} color="white">
                .75
              </SliderMark>
              <SliderMark value={1.5} mt={3} ml={-2.5} color="white">
                1.5
              </SliderMark>
              <SliderMark value={2.25} mt={3} ml={-2.5} color="white">
                2.25
              </SliderMark>
              <SliderTrack bg="red.100">
                <SliderFilledTrack bg="tomato" />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="tomato" as={TbRulerMeasure} />
              </SliderThumb>
            </Slider>
          </FormControl>
          <FormControl>
            <FormLabel color="white">Time Window (minutes)</FormLabel>
            <Heading color="white">{`${timeWindow} ${timeUnit}`}</Heading>
          </FormControl>
        </VStack>
      </Box>
      <Box p={8}>
        <ParentSize>
          {({ height, width }) => (
            <TemperatureChart
              parentHeight={height}
              parentWidth={width}
              slope={getTemperatureChangeSlope(thickness, temperature)}
              intercept={50}
              max={temperature}
            />
          )}
        </ParentSize>
      </Box>
    </Grid>
  );
};

export default TemperatureGraph;

// Multi-variate linear regression didn't fit the data very well
// until I added a temperature/thickness ratio instead of just
// the temperature and thickness variables.

function getTemperatureChangeSlope(thickness: number, temperature: number) {
  // SUPER, SUPER, rough estimate
  const thicknessWeight = 0.018794918;
  const temperatureWeight = 0.006954229;
  const intercept = -1.539526048;

  return (
    thicknessWeight * (temperature / thickness) +
    temperatureWeight * temperature +
    intercept
  );
}

type TemperatureProps = {
  parentHeight: number;
  parentWidth: number;
  slope: number;
  intercept: number;
  max: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

type Datum = {
  time: number;
  temperature: number;
};

const TemperatureChart = ({
  parentHeight,
  parentWidth,
  slope,
  intercept,
  max,
  margin = { top: 10, right: 20, bottom: 80, left: 80 },
}: TemperatureProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const width = parentWidth - margin.left - margin.right;
  const height = parentHeight - margin.top - margin.bottom;

  const data = Array.from(Array(100).keys()).map((i) => ({
    time: i,
    temperature: getInternalTemperature(i, slope, intercept, max),
  }));

  const x = (d: Datum) => d.time;
  const y = (d: Datum) => d.temperature;

  const xScale = scaleLinear<number>({
    range: [0, width],
    domain: [0, 100],
  });

  const yScale = scaleLinear<number>({
    range: [height, 0],
    domain: [0, max + 10],
  });

  return (
    <svg ref={svgRef} width={parentWidth} height={parentHeight}>
      <Group top={margin.top} left={margin.left}>
        <AnimatedGridRows scale={yScale} width={width} stroke="#e0e0e0" />
        <GridColumns
          scale={xScale}
          width={width}
          height={height}
          stroke="#e0e0e0"
        />
        <AxisBottom
          top={height}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke="#e0e0e0"
          tickLabelProps={{
            fill: "#eaeaea",
            fontFamily: "JetBrains Mono",
            fontSize: 20,
            textAnchor: "middle",
            dy: "0.33em",
          }}
        />
        <text
          x="-400"
          y="-60"
          transform="rotate(-90)"
          fontFamily="JetBrains Mono"
          fontSize={20}
          fill="#fff"
        >
          Temperature (°F)
        </text>
        <AnimatedAxis
          orientation="left"
          scale={yScale}
          stroke="#e0e0e0"
          tickStroke="#eaeaea"
          tickLabelProps={{
            fill: "#eaeaea",
            fontFamily: "JetBrains Mono",
            fontSize: 20,
            textAnchor: "end",
            dy: "0.33em",
          }}
        />
        <text
          x={xScale(100 / 2) - 14}
          y={yScale(0) + 70}
          fontFamily="JetBrains Mono"
          fontSize={20}
          fill="#fff"
        >
          Minute
        </text>

        <LinearGradient
          id="fill"
          from="#ff6347"
          to="#a6c1ee"
          fromOpacity={0.2}
          toOpacity={0}
        />

        <PatternLines
          id="diagonalLines"
          height={6}
          width={6}
          stroke="#e0e0e0"
          strokeWidth={1}
          orientation={["diagonal"]}
        />
        <AreaClosed
          stroke="transparent"
          data={data}
          yScale={yScale}
          x={(d) => xScale(x(d))}
          y={(d) => yScale(y(d))}
          fill="url(#fill)"
          curve={curveNatural}
        />

        <LinePath
          data={data}
          y={(d) => yScale(y(d))}
          x={(d) => xScale(x(d))}
          stroke="#ff6347"
          strokeWidth={4}
          curve={curveNatural}
        />
      </Group>
    </svg>
  );
};

function getInternalTemperature(
  time: number,
  slope: number,
  intercept: number,
  max: number
) {
  return Math.min(slope * time + intercept, max);
}
