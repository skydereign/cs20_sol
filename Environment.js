//Environment object
//Will have many children for the various lights
//Perhaps will be layered 'under' the lights, held in the level itself
//Holds things like gravity, and alterations to the player's physics
function Environment() {
	//Some examples
	this.x_acceleration_mod;
	this.y_acceleration_mod; //Gravity, right here.
	this.x_velocity_mod;
	this.y_velocity_mod;
	this.x_acceleration_cap_mod;
	this.y_acceleration_cap_mod;
	this.x_velocity_cap_mod;
	this.y_velocity_cap_mod;
}
