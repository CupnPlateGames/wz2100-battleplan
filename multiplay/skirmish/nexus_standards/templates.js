
//Original Nexus AI template set. These are selected randomly within a certain limit.


const HOVER_PROPULSIONS = [
	"hover01",
];

const VTOL_PROPULSIONS = [
	"V-Tol",
];

const HELICOPTER_PROPULSIONS = [
];

const CYBORG_COMPONENTS = [
];

const TWO_TURRET_BODY = [
];

//const THREE_TURRET_BODY = [];

const STANDARD_TEMPLATES = [
	// Scout
	{ body: "B-D3-SNP", prop: "wheeled01", weaps: ["W-Z11-Scout"] },
	{ body: "B-C3-SP", prop: "wheeled01", weaps: ["W-Z11-Scout"] },
	// MG light
	{ body: "B-D3-SNP", prop: "wheeled01", weaps: ["W-A13-MG1"] },
	{ body: "B-C3-SP", prop: "wheeled01", weaps: ["W-A13-MG1"] },
	{ body: "B-B3-SC", prop: "tracked01", weaps: ["W-A13-MG1"] },
	// Cannon light
	{ body: "B-C3-SP", prop: "wheeled01", weaps: ["W-C13-Cannon1"] },
	{ body: "B-C3-SP", prop: "tracked01", weaps: ["W-C13-Cannon1"] },
	{ body: "B-B3-SC", prop: "tracked01", weaps: ["W-C13-Cannon1"] },
	// Flamer light
	{ body: "B-D3-SNP", prop: "hover01", weaps: ["W-B13-Flamer1"] },
	{ body: "B-C3-SP", prop: "hover01", weaps: ["W-B13-Flamer1"] },
	// Missile light
	{ body: "B-C3-SP", prop: "wheeled01", weaps: ["W-D13-Missile1"] },
	{ body: "B-C3-SP", prop: "tracked01", weaps: ["W-D13-Missile1"] },
	// Rocket light
	{ body: "B-D3-SNP", prop: "hover01", weaps: ["W-E13-Rocket1"] },
	{ body: "B-C3-SP", prop: "wheeled01", weaps: ["W-E13-Rocket1"] },
	// Mortar light
	{ body: "B-D3-SNP", prop: "wheeled01", weaps: ["W-F13-Mortar1"] },
	// Howitzer light
	{ body: "B-D3-SNP", prop: "wheeled01", weaps: ["W-G13-Howitzer1"] },

	// MG medium
	{ body: "B-D2-MNP", prop: "wheeled01", weaps: ["W-A12-MG2"] },
	{ body: "B-C2-MP", prop: "wheeled01", weaps: ["W-A12-MG2"] },
	// Cannon medium
	{ body: "B-C2-MP", prop: "wheeled01", weaps: ["W-C12-Cannon2"] },
	{ body: "B-C2-MP", prop: "tracked01", weaps: ["W-C12-Cannon2"] },
	{ body: "B-B2-MC", prop: "tracked01", weaps: ["W-C12-Cannon2"] },
	// Flamer medium
	{ body: "B-D2-MNP", prop: "hover01", weaps: ["W-B12-Flamer2"] },
	{ body: "B-C2-MP", prop: "hover01", weaps: ["W-B12-Flamer2"] },
	// Missile medium
	{ body: "B-C2-MP", prop: "wheeled01", weaps: ["W-D12-Missile2"] },
	{ body: "B-C2-MP", prop: "tracked01", weaps: ["W-D12-Missile2"] },
	// Rocket medium
	{ body: "B-D2-MNP", prop: "hover01", weaps: ["W-E12-Rocket2"] },
	{ body: "B-C2-MP", prop: "wheeled01", weaps: ["W-E12-Rocket2"] },
	// Mortar medium
	{ body: "B-D2-MNP", prop: "wheeled01", weaps: ["W-F12-Mortar2"] },
	// Howitzer medium
	{ body: "B-D2-MNP", prop: "wheeled01", weaps: ["W-G12-Howitzer2"] },

	// MG heavy
	{ body: "B-D1-LNP", prop: "wheeled01", weaps: ["W-A11-MG3"] },
	{ body: "B-C1-LP", prop: "wheeled01", weaps: ["W-A11-MG3"] },
	// Cannon heavy
	{ body: "B-C1-LP", prop: "wheeled01", weaps: ["W-C11-Cannon3"] },
	{ body: "B-C1-LP", prop: "tracked01", weaps: ["W-C11-Cannon3"] },
	{ body: "B-B1-LC", prop: "tracked01", weaps: ["W-C11-Cannon3"] },
	// Flamer heavy
	{ body: "B-D1-LNP", prop: "hover01", weaps: ["W-B11-Flamer3"] },
	{ body: "B-C1-LP", prop: "hover01", weaps: ["W-B11-Flamer3"] },
	// Missile heavy
	{ body: "B-C1-LP", prop: "wheeled01", weaps: ["W-D11-Missile3"] },
	{ body: "B-C1-LP", prop: "tracked01", weaps: ["W-D11-Missile3"] },
	// Rocket heavy
	{ body: "B-D1-LNP", prop: "hover01", weaps: ["W-E11-Rocket3"] },
	{ body: "B-C1-LP", prop: "wheeled01", weaps: ["W-E11-Rocket3"] },
	// Mortar heavy
	{ body: "B-D1-LNP", prop: "wheeled01", weaps: ["W-F11-Mortar3"] },
	// Howitzer heavy
	{ body: "B-D1-LNP", prop: "wheeled01", weaps: ["W-G11-Howitzer3"] },
];

const STANDARD_TRUCK_TEMPLATES = [
	{ body: "B-C3-SP", prop: "wheeled01", weaps: ["Spade1Mk1",] },
	{ body: "B-D3-SNP", prop: "hover01", weaps: ["Spade1Mk1",] },
];

const STANDARD_TANK_REPAIRS = [
	{ body: "B-C3-SP", prop: "wheeled01", weaps: ["T-L3-Repair1"] },
	{ body: "B-B3-SC", prop: "tracked01", weaps: ["T-L3-Repair1"] },
	{ body: "B-C2-MP", prop: "wheeled01", weaps: ["T-L2-Repair2"] },
	{ body: "B-B2-MC", prop: "tracked01", weaps: ["T-L2-Repair2"] },
	{ body: "B-B1-LC", prop: "tracked01", weaps: ["T-L2-Repair2"] },
];

const STANDARD_SENSOR_TEMPLATES = [
	{ body: "B-C3-SP", prop: "wheeled01", weaps: ["SensorTurret1Mk1"] },
	{ body: "B-B3-SC", prop: "tracked01", weaps: ["SensorTurret1Mk1"] },
	{ body: "B-B2-MC", prop: "tracked01", weaps: ["R-Sys-Sensor-WS"] },
];

const STANDARD_LIGHT_CYBORG_TEMPLATES = [
];

const STANDARD_CYBORG_MECHANIC_TEMPLATES = [
];

const STANDARD_CYBORG_ENGINEER_TEMPLATES = [
];

const STANDARD_SUPER_CYBORG_TEMPLATES = [
];

const STANDARD_VTOL_TEMPLATES = [
	// Scout
	{ body: "B-D3-SNP", prop: "V-Tol", weaps: ["W-Z11-VTOLScout"] },
	{ body: "B-C3-SP", prop: "V-Tol", weaps: ["W-Z11-VTOLScout"] },
	{ body: "B-B3-SC", prop: "V-Tol", weaps: ["W-Z11-VTOLScout"] },
	// MG light
	{ body: "B-D3-SNP", prop: "V-Tol", weaps: ["W-A13-VTOLMG1"] },
	{ body: "B-C3-SP", prop: "V-Tol", weaps: ["W-A13-VTOLMG1"] },
	// Flamer light
	{ body: "B-D3-SNP", prop: "V-Tol", weaps: ["W-B13-VTOLFlamer1"] },
	{ body: "B-C3-SP", prop: "V-Tol", weaps: ["W-B13-VTOLFlamer1"] },
	// Rocket light
	{ body: "B-D3-SNP", prop: "V-Tol", weaps: ["W-E13-VTOLRocket1"] },
	{ body: "B-C3-SP", prop: "V-Tol", weaps: ["W-E13-VTOLRocket1"] },

	// MG medium
	{ body: "B-D2-MNP", prop: "V-Tol", weaps: ["W-A12-VTOLMG2"] },
	{ body: "B-C2-MP", prop: "V-Tol", weaps: ["W-A12-VTOLMG2"] },
	// Flamer medium
	{ body: "B-D2-MNP", prop: "V-Tol", weaps: ["W-B12-VTOLFlamer2"] },
	{ body: "B-C2-MP", prop: "V-Tol", weaps: ["W-B12-VTOLFlamer2"] },
	// Rocket medium
	{ body: "B-D2-MNP", prop: "V-Tol", weaps: ["W-E12-VTOLRocket2"] },
	{ body: "B-C2-MP", prop: "V-Tol", weaps: ["W-E12-VTOLRocket2"] },
	// Bomb medium
	{ body: "B-D2-MNP", prop: "V-Tol", weaps: ["W-F12-VTOLMortar2"] },

	// MG heavy
	{ body: "B-D1-LNP", prop: "V-Tol", weaps: ["W-A11-VTOLMG3"] },
	{ body: "B-C1-LP", prop: "V-Tol", weaps: ["W-A11-VTOLMG3"] },
	// Flamer heavy
	{ body: "B-D1-LNP", prop: "V-Tol", weaps: ["W-B11-VTOLFlamer3"] },
	{ body: "B-C1-LP", prop: "V-Tol", weaps: ["W-B11-VTOLFlamer3"] },
	// Rocket heavy
	{ body: "B-D1-LNP", prop: "V-Tol", weaps: ["W-E11-VTOLRocket3"] },
	{ body: "B-C1-LP", prop: "V-Tol", weaps: ["W-E11-VTOLRocket3"] },
	// Bomb heavy
	{ body: "B-D1-LNP", prop: "V-Tol", weaps: ["W-F11-VTOLMortar3"] },
];
