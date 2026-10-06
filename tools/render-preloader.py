"""Render the SECHA modular lounge-chair intro with Blender, then encode using FFmpeg.
Run: blender -b -t 2 -P tools/render-preloader.py -- /tmp/secha-frames
"""
import bpy, math, sys
from pathlib import Path
from mathutils import Vector
output = Path(sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else '/tmp/secha-frames')
output.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='BLENDER_WORKBENCH'
scene.display.shading.light='STUDIO'
scene.display.shading.studiolight_rotate_z=math.radians(25)
scene.display.shading.color_type='MATERIAL'
scene.display.shading.show_shadows=True
scene.display.shading.show_cavity=True
scene.display.shading.cavity_type='BOTH'
scene.display.shading.background_type='WORLD'
scene.world.color=(0.865,0.836,0.775)
scene.render.resolution_x=960; scene.render.resolution_y=540; scene.render.resolution_percentage=100
scene.render.fps=24;scene.frame_start=1;scene.frame_end=96
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(output)+'/'

def material(name,color):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);return m
wood=material('Warm oak',(0.38,0.23,0.12));linen=material('Ivory upholstery',(0.78,0.74,0.65));floor=material('Warm paper',(0.865,0.836,0.775))

def piece(name,location,scale,mat,offset,start,end,bevel=.08):
 bpy.ops.mesh.primitive_cube_add(size=1,location=location)
 obj=bpy.context.object;obj.name=name;obj.dimensions=scale
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 obj.data.materials.append(mat)
 mod=obj.modifiers.new('Soft edges','BEVEL');mod.width=bevel;mod.segments=5
 obj.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 final=Vector(location);obj.location=final+Vector(offset);obj.keyframe_insert(data_path='location',frame=1);obj.keyframe_insert(data_path='location',frame=start)
 obj.location=final;obj.keyframe_insert(data_path='location',frame=end)
 for f in obj.animation_data.action.fcurves:
  for k in f.keyframe_points:k.interpolation='BEZIER'
 return obj
# Each component travels independently into a tangible, assembled chair.
for x in [-.82,.82]:
 for y in [-.72,.72]:piece('Oak leg',(x,y,.36),(.16,.16,.72),wood,(x*1.4,y*1.4,-.3),5,30,.025)
piece('Seat frame',(0,0,.76),(1.94,1.84,.18),wood,(0,0,1.45),15,43,.035)
for x in [-.94,.94]:
 piece('Arm support',(x,0,1.12),(.14,1.8,.68),wood,(x*1.9,0,.3),27,55,.035)
 piece('Oak armrest',(x,-.04,1.5),(.23,1.96,.16),wood,(x*1.9,0,.55),32,60,.045)
piece('Seat cushion',(0,-.07,1.03),(1.61,1.64,.4),linen,(0,-2.2,1.2),42,70,.16)
back=piece('Back cushion',(0,.65,1.62),(1.6,.35,1.05),linen,(0,1.8,1.7),49,78,.14);back.rotation_euler.x=math.radians(10)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.05));bpy.context.object.data.materials.append(floor)
bpy.ops.object.camera_add(location=(4,-6,3.6));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,1.1))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=7.3;scene.camera=camera
scene.view_settings.view_transform='Standard'
bpy.ops.render.render(animation=True)
