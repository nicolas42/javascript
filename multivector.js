// Resources
// https://github.com/enkimute/ganja.js
// https://www.euclideanspace.com/maths/algebra/clifford/d3/arithmetic/index.htm

function init(){
    return [0,0,0,0,0,0,0,0];
}

function scalar(a){
    return [a,0,0,0,0,0,0,0];
}

function vector(a){
    return [0,a[0],a[1],a[2],0,0,0,0];
}

function bivector(a){
    return [0,0,0,0,a[0],a[1],a[2],0];
}

function trivector(a){
    return [0,0,0,0,0,0,0,a];
}

// function copy(a, b){
//     return [0,0,0,0,0,0,0,a];
// }

function mul(a, b){


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

function multiply(){
    multivectors = Array.from(arguments);
    var result = [1,0,0,0,0,0,0,0];
    multivectors.forEach(
        function( multivector ){
            result = mul( result, multivector );
        }
    );
    return result;
}

// Spherical coordinates
// x = cos(theta); y = cos(theta-90); z = cos(phi); 

// Import Math
Object.getOwnPropertyNames(Math).forEach( function ( a ) { eval( a + "=Math." + a ); console.log(a); });     

T = 2*PI;

v = vector([cos(T/8), sin(T/8), 0]);
a = vector([cos(T/8), sin(T/8), 0]);
b = vector([cos(T/8)*sin(T/8), sin(T/8)*sin(T/8), cos(T/8)]);
ba=mul(b,a); bav=mul(ba,v); bava=mul(bav,a); bavab=mul(bava,b); 

ba=mul(b,a); ab=mul(a,b); bav=mul(ba,v); bavab=mul(bav,ab); 
r=bavab;

multiply(b,a,v,a,b);

