// Resources
// https://github.com/enkimute/ganja.js
// https://www.euclideanspace.com/maths/algebra/clifford/d3/arithmetic/index.htm
// https://marctenbosch.com/quaternions/


// The multivectors are of the form [ e0 e1 e2 e3 e12 e23 e31 e123 ]
// which correspond to [ scalar x y z xy yz zx xyz ]

function init(){
    return [0,0,0,0,0,0,0,0];
}

function scalar(a){
    return [a,0,0,0,0,0,0,0];
}

function vector(a,b,c){
    return [0,a,b,c,0,0,0,0];
}

function bivector(a,b,c){
    return [0,0,0,0,a,b,c,0];
}

function trivector(a){
    return [0,0,0,0,0,0,0,a];
}

function mul(){

    // multivector product in R3
    // c.e0     =   +a.e0*b.e0  +a.e1*b.e1  +a.e2*b.e2  +a.e3*b.e3  -a.e12*b.e12 -a.e23*b.e23 -a.e31*b.e31 -a.e123*b.e123;
    // c.e1     =   +a.e0*b.e1  +a.e1*b.e0  -a.e2*b.e12  +a.e3*b.e31  +a.e12*b.e2 -a.e23*b.e123 -a.e31*b.e3 -a.e123*b.e23;
    // c.e2     =   +a.e0*b.e2  +a.e1*b.e12  +a.e2*b.e0  -a.e3*b.e23  -a.e12*b.e1 +a.e23*b.e3 -a.e31*b.e123 -a.e123*b.e31;
    // c.e3     =   +a.e0*b.e3  -a.e1*b.e31  +a.e2*b.e23  +a.e3*b.e0  -a.e12*b.e123 -a.e23*b.e2 +a.e31*b.e1 -a.e123*b.e12;
    // c.e12    =   +a.e0*b.e12  +a.e1*b.e2  -a.e2*b.e1  +a.e3*b.e123  +a.e12*b.e0 -a.e23*b.e31 +a.e31*b.e23 +a.e123*b.e3;
    // c.e23    =   +a.e0*b.e23  +a.e1*b.e123  +a.e2*b.e3  -a.e3*b.e2  +a.e12*b.e31 +a.e23*b.e0 -a.e31*b.e12 +a.e123*b.e1;
    // c.e31    =   +a.e0*b.e31  -a.e1*b.e3  +a.e2*b.e123  +a.e3*b.e1  -a.e12*b.e23 +a.e23*b.e12 +a.e31*b.e0 +a.e123*b.e2;
    // c.e123   =   +a.e0*b.e123  +a.e1*b.e23  +a.e2*b.e31  +a.e3*b.e12  +a.e12*b.e3 +a.e23*b.e1 +a.e31*b.e2 +a.e123*b.e0;    

    // "All the pieces matter" - Lester Freamon

    function geometric_product(a, b){

            c = [0, 0,0,0, 0,0,0, 0];
        c[0]   =   +a[0]*b[0]  +a[1]*b[1]  +a[2]*b[2]  +a[3]*b[3]  -a[4]*b[4] -a[5]*b[5] -a[6]*b[6] -a[7]*b[7];
        c[1]   =   +a[0]*b[1]  +a[1]*b[0]  -a[2]*b[4]  +a[3]*b[6]  +a[4]*b[2] -a[5]*b[7] -a[6]*b[3] -a[7]*b[5];
        c[2]   =   +a[0]*b[2]  +a[1]*b[4]  +a[2]*b[0]  -a[3]*b[5]  -a[4]*b[1] +a[5]*b[3] -a[6]*b[7] -a[7]*b[6];
        c[3]   =   +a[0]*b[3]  -a[1]*b[6]  +a[2]*b[5]  +a[3]*b[0]  -a[4]*b[7] -a[5]*b[2] +a[6]*b[1] -a[7]*b[4];
        c[4]   =   +a[0]*b[4]  +a[1]*b[2]  -a[2]*b[1]  +a[3]*b[7]  +a[4]*b[0] -a[5]*b[6] +a[6]*b[5] +a[7]*b[3];
        c[5]   =   +a[0]*b[5]  +a[1]*b[7]  +a[2]*b[3]  -a[3]*b[2]  +a[4]*b[6] +a[5]*b[0] -a[6]*b[4] +a[7]*b[1];
        c[6]   =   +a[0]*b[6]  -a[1]*b[3]  +a[2]*b[7]  +a[3]*b[1]  -a[4]*b[5] +a[5]*b[4] +a[6]*b[0] +a[7]*b[2];
        c[7]   =   +a[0]*b[7]  +a[1]*b[5]  +a[2]*b[6]  +a[3]*b[4]  +a[4]*b[3] +a[5]*b[1] +a[6]*b[2] +a[7]*b[0];    
        return c;
    }
    
    multivectors = Array.from(arguments);
    var result = [1,0,0,0,0,0,0,0];
    multivectors.forEach(
        function( multivector ){
            result = geometric_product( result, multivector );
        }
    );
    return result;
}

function rotate(v,a,b){
    // Rotate v by twice the angle between a and b;
    return mul(b,a,v,a,b);
}

function rot(a,b){
    // rotate a by twice the angle between itself and b
    return mul(b,a,a,a,b);
}

function vector_spherical(r, theta, phi=Math.PI/2){
    // Spherical coordinates
    // x = cos(theta)*sin(phi); y = cos(theta-90)*sin(phi); z = cos(phi); 
    return vector(
        r*Math.cos(theta)*Math.sin(phi), 
        r*Math.sin(theta)*Math.sin(phi), 
        r*Math.cos(phi)
    );
}

function print(arg){
    var o = [];
    
    arg.forEach(function(a){
        if (Math.abs(a) < 1e-10) { a = 0.0 }
        o.push(a.toFixed(1));
    });
    return o.join(", ");
}

function print_scalar(a){
    console.log( "scalar( " + print(a.slice(1,2)) + " )" );
}

function print_vector(a){
    console.log( "vector( " + print(a.slice(1,4)) + " )");
}

function print_bivector(a){
    console.log( "bivector( " + print(a.slice(4,7)) + " )");
}

function print_trivector(a){
    console.log( "trivector( " + print(a.slice(7)) + " )");
}

// console.log("Import math object");
// Object.getOwnPropertyNames(Math).forEach( function ( a ) { eval( a + "=Math." + a ); });     

T = 2*Math.PI; // Tau or '1 turn'

// length
a = vector(1,1,0);
r = mul(a,a);
print_scalar(r);

r = mul(vector_spherical(1, T/8),vector_spherical(1, T/8));
print_scalar(r);

// area
r = mul(vector(1,0,0), vector(0,1,0));
print_bivector(r);

r = mul(vector_spherical(1,T/8), vector_spherical(1,3*T/8));
print_bivector(r);

// volume
r = mul(vector(1,0,0), vector(0,1,0), vector(0,0,1));
print_trivector(r);

r = mul(vector_spherical(1, T/8), vector_spherical(1, 3*T/8), vector(0,0,1));
print_trivector(r);

// 2D rotation (complex numbers)
r = mul(vector(1,0,0), bivector(1,0,0)); 
print(r);

spinor = mul(vector(1,0,0), vector_spherical(1,T/12))
r = mul(vector(1,0,0), spinor);
print(r);


// 3D rotation (multiply v by twice the angle between a and b)
v = vector(1,0,0);
a = vector_spherical(1, T/8);
b = vector_spherical(1, T/8, T/8);
r = mul(b,a,v,a,b);
print(r);

// spinor1 = mul(vector(1,0,0), vector_spherical(1,T/8))
// spinor2 = mul(vector(1,0,0), vector_spherical(1,T/8,T/4))
// mul(vector(1,0,0), spinor1, spinor2);

// chirality???
mul(trivector(3), trivector(4));
