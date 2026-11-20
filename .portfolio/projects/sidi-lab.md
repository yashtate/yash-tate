+++
title = "Scissor-Lift Heated Bed for Swarm Manufacturing"
category = "UT Austin SiDi Lab"
role = "Manufacturing and assembly"
status = "Research prototype"
summary = "I helped manufacture and assemble a swappable, height-adjustable heated print bed for a UR5e robotic-arm printer."
problem = "Bring the build surface within reach of a robotic arm while supporting print adhesion and part release."
hero = "sidi-heated-bed-assembly"
heroCaption = "The SiDi Lab team’s full assembly model, showing the raised print surface, scissor linkage, and base."
draft = false
featured = false
+++

## My contribution

I joined the SiDi Lab project midway through development at The University of Texas at Austin, under the supervision of Dr. Sha. The team had already developed the design. I helped manufacture parts and assemble the prototype, turning the lab’s design into hardware for the robotic printing setup.

## Research goal

The lab paired a **Universal Robots UR5e** arm configured for 3D printing with a **swappable heated bed**. Raising and lowering the build surface relative to the arm was intended to expand the heights at which the toolhead could reach it. The broader swarm manufacturing research goal was to test how repositionable build surfaces could extend the usable workspace beyond a single fixed print bed.

## Heated print surface

The team designed the heated surface around an array of **custom resistive PCBs**. Distributing the heaters across the surface was intended to make heating more uniform and improve first-layer adhesion. After printing, integrated fans were intended to cool the bed more quickly and help finished parts release from the surface.

::: {.case-pair}
{{figure:sidi-heater-pcb}}
{{figure:sidi-pcb-layout}}
:::

## Scissor lift and actuation

A **NEMA 24 motor and ball screw** actuated the scissor linkage. The linkage was designed to raise the bed above the arm’s base and lower it near floor level. Moving the surface relative to the arm gave the setup a way to change the print height. The lowered position also supported the planned fan-assisted cooldown and part-release cycle.

{{figure:sidi-lift-linkage}}
