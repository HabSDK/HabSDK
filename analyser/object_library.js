function HabObjectTypes() {
    return [
        new HabObjectType("bed", new Point3D(8, 3, 4), {
            "mass":10,
        }),
        new HabObjectType("cupboard", new Point3D(2, 2, 4), {
            "mass":10,
        }),
        new HabObjectType("composter", new Point3D(4, 4, 4), {
            "mass":10,
        }),
        new HabObjectType("fridge", new Point3D(2, 2, 4), {
            "mass":10,
        }),
        new HabObjectType("growbox", new Point3D(4, 4, 2), {
            "mass":10,
        }),
        new HabObjectType("microscope", new Point3D(1, 1, 1), {
            "mass":10,
        }),
        new HabObjectType("sink", new Point3D(1, 1, 1), {
            "mass":10,
        }),
        new HabObjectType("toilet", new Point3D(3, 3, 4), {
            "sanity":5,
            "happiness":10
        }),
    ]
}