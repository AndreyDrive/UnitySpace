describe("ConfigurateManager", function() {
    var configurateManager;

    beforeEach(function() {
        configurateManager = new UnitySpace.ConfigurateManager({
            application: {
                name: 'test'
            },
            system: true
        })
    });

    it("should be able get param", function() {
        expect(configurateManager.get('application.name')).toEqual('test');
        expect(configurateManager.get('system')).toBeTruthy();
    });

    it("should be able get default param", function() {
        expect(configurateManager.get('application.description', 'description')).toEqual('description');
        expect(configurateManager.get('system.protected', true)).toBeTruthy();
    });

    it("should be able get nonexistent param", function() {
        expect(configurateManager.get('application.name.test')).toBeUndefined();
        expect(configurateManager.get('system.test')).toBeUndefined();
    });

    it("should be able set param", function() {
        configurateManager.set('application.name', 'test1');
        expect(configurateManager.get('application.name')).toEqual('test1');
        configurateManager.set('system', false);
        expect(configurateManager.get('system')).toBeFalsy();
    });
});