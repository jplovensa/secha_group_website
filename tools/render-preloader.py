"""Render modular seating, a table, and a shelving wall for the SECHA intro.
Run: blender -b -t 2 -P tools/render-preloader.py -- /tmp/secha-frames
Encode the RGBA frames over a paper background with FFmpeg (see README).
"""
import bpy
import math
import sys
from pathlib import Path
from mathutils import Vector

output = Path(sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '/tmp/secha-frames')
output.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_WORKBENCH'
scene.display.shading.light = 'STUDIO'
scene.display.shading.studiolight_rotate_z = math.radians(35)
scene.display.shading.color_type = 'MATERIAL'
scene.display.shading.show_shadows = True
scene.display.shading.show_cavity = True
scene.display.shading.cavity_type = 'BOTH'
scene.display.shading.show_specular_highlight = False
scene.render.film_transparent = True
scene.render.resolution_x = 960
scene.render.resolution_y = 540
scene.render.resolution_percentage = 100
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 120
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.filepath = str(output) + '/'
scene.view_settings.view_transform = 'Standard'
scene.view_settings.exposure = 0.5


def material(name, color):
    result = bpy.data.materials.new(name)
    result.diffuse_color = (*color, 1)
    return result


oak = material('Natural oak', (0.49, 0.31, 0.16))
linen = material('Warm ivory linen', (0.83, 0.79, 0.70))
navy = material('Architect navy', (0.055, 0.09, 0.13))
stone = material('Travertine', (0.67, 0.60, 0.48))


def piece(name, location, size, finish, offset, start, end, bevel=0.06):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(finish)
    modifier = obj.modifiers.new('Crafted edges', 'BEVEL')
    modifier.width = bevel
    modifier.segments = 5
    obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    destination = Vector(location)
    obj.location = destination + Vector(offset)
    obj.keyframe_insert(data_path='location', frame=1)
    obj.keyframe_insert(data_path='location', frame=start)
    obj.location = destination
    obj.keyframe_insert(data_path='location', frame=end)
    for curve in obj.animation_data.action.fcurves:
        for key in curve.keyframe_points:
            key.interpolation = 'BEZIER'
    return obj


# A three-part sofa assembles left-to-right, frame first, upholstery second.
for x in [-1.4, 0, 1.4]:
    piece('Oak seat module', (x, 0.45, 0.55), (1.38, 1.4, 0.18), oak,
          (x * 0.5, -2.6, 0.2), 8, 35, 0.04)
    for y in [-0.05, 0.95]:
        piece('Navy support', (x, y, 0.24), (1.05, 0.14, 0.46), navy,
              (0, 0, -1.3), 4, 24, 0.025)
    piece('Linen seat module', (x, 0.39, 0.88), (1.32, 1.28, 0.45), linen,
          (0, -0.7, 2.5), 25 + int((x + 1.4) * 4), 53 + int((x + 1.4) * 4), 0.13)
    back = piece('Linen back module', (x, 1.04, 1.4), (1.32, 0.3, 1.08), linen,
                 (0, 2.0, 1.1), 35 + int((x + 1.4) * 4), 62 + int((x + 1.4) * 4), 0.12)
    back.rotation_euler.x = math.radians(8)
for x in [-2.13, 2.13]:
    piece('Oak arm module', (x, 0.45, 1.02), (0.16, 1.45, 0.9), oak,
          (x * 0.8, 0, 0), 32, 62, 0.04)
# Table legs click in before the stone top settles.
for x in [-0.65, 0.65]:
    piece('Table plinth', (x, -1.27, 0.25), (0.3, 0.65, 0.5), oak,
          (x * 2, 0, -0.9), 53, 76, 0.035)
piece('Stone table top', (0, -1.27, 0.58), (2.18, 0.94, 0.18), stone,
      (0, -1, 2), 64, 88, 0.07)
# A shelving backdrop frames the completed room.
for x in [-2.18, 0, 2.18]:
    piece('Shelving upright', (x, 1.75, 1.4), (0.12, 0.35, 2.8), oak,
          (0, 1.2, 3), 55, 82, 0.025)
for z in [0.08, 1.0, 1.92, 2.8]:
    piece('Shelf module', (0, 1.75, z), (4.48, 0.4, 0.12), oak,
          (0, 2, 0.5), 65, 92, 0.025)
for x in [-1.5, 1.55]:
    piece('Navy storage box', (x, 1.72, 2.2), (0.65, 0.3, 0.43), navy,
          (0, 0, 2), 81, 102, 0.025)

bpy.ops.object.camera_add(location=(5.8, -8.2, 4.7))
camera = bpy.context.object
camera.rotation_euler = (Vector((0, 0.7, 1.5)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 10.5
camera.data.keyframe_insert(data_path='ortho_scale', frame=1)
camera.data.ortho_scale = 9.4
camera.data.keyframe_insert(data_path='ortho_scale', frame=108)
scene.camera = camera
bpy.ops.render.render(animation=True)
