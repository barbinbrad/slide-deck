import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Select,
  VStack,
} from "@chakra-ui/react";
import { AxisBottom } from "@visx/axis";
import { curveNatural } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { GridColumns } from "@visx/grid";
import { Group } from "@visx/group";
import { PatternLines } from "@visx/pattern";
import { scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { ParentSize } from "@visx/responsive";
import { useRef, useState } from "react";
import { AnimatedAxis, AnimatedGridRows } from "@visx/react-spring";

enum Method {
  Grill = "grill",
  SousVide = "sous-vide",
  Oven = "oven",
}

const MoistureGraph = () => {
  const [method, setMethod] = useState(Method.SousVide);

  return (
    <Grid gridTemplateColumns={["1fr", "1fr", "2fr 5fr"]} w="full" h="full">
      <Box w="full" py={14} px={8} borderRight="1px solid #373737">
        <VStack spacing={12}>
          <FormControl>
            <FormLabel color="white">Method</FormLabel>
            <Heading color="white" mb={4}>
              {method}
            </Heading>
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
          </FormControl>
        </VStack>
      </Box>
      <Box p={8}>
        <ParentSize>
          {({ height, width }) => (
            <MoistureChart
              parentHeight={height}
              parentWidth={width}
              slope={getMoistureChangeSlope(method)}
              intercept={80}
            />
          )}
        </ParentSize>
      </Box>
    </Grid>
  );
};

export default MoistureGraph;

// Multi-variate linear regression didn't fit the data very well
// until I added a moisture/thickness ratio instead of just
// the moisture and thickness variables.

function getMoistureChangeSlope(method: Method) {
  switch (method) {
    case Method.Grill:
      return -15;
    case Method.SousVide:
      return 0;
    case Method.Oven:
      return -1;
    default:
      throw new Error("Invalid method");
  }
}

type MoistureProps = {
  parentHeight: number;
  parentWidth: number;
  slope: number;
  intercept: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

type Datum = {
  time: number;
  moisture: number;
};

const MoistureChart = ({
  parentHeight,
  parentWidth,
  slope,
  intercept,
  margin = { top: 10, right: 20, bottom: 80, left: 80 },
}: MoistureProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const width = parentWidth - margin.left - margin.right;
  const height = parentHeight - margin.top - margin.bottom;

  const data = Array.from(Array(100).keys()).map((i) => ({
    time: i,
    moisture: getExternalMoisture(i, slope, intercept),
  }));

  const x = (d: Datum) => d.time;
  const y = (d: Datum) => d.moisture;

  const xScale = scaleLinear<number>({
    range: [0, width],
    domain: [0, 100],
  });

  const yScale = scaleLinear<number>({
    range: [height, 0],
    domain: [0, 100],
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
          Surface Moisture (%)
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
          id="blue-fill"
          from="#4784ff"
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
          fill="url(#blue-fill)"
          curve={curveNatural}
        />

        <LinePath
          data={data}
          y={(d) => yScale(y(d))}
          x={(d) => xScale(x(d))}
          stroke="#4784ff"
          strokeWidth={4}
          curve={curveNatural}
        />
      </Group>
    </svg>
  );
};

function getExternalMoisture(time: number, slope: number, intercept: number) {
  return Math.max(slope * time + intercept, 0);
}
