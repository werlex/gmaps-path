
const latLngArrayMap = array => array.map(marker => { return {lat: marker.lat, lng: marker.lng} })
const calcPathDistance = array => array.reduce((a, b, index) =>
  index
  ? { id: b.id, distance: a.distance + b.distances.find(distance => distance.id === a.id).distance }
  : { id: b.id, distance: 0 }
, 0)

const shortestPath = (markers) => {
  const shortestPath = [];
  const polylineSearch = [];
  shortestPath.push(markers[0]);
  const lastID = () => shortestPath[shortestPath.length - 1]['id'];

  for(let i = 1; i < markers.length; i++){
    let shortestDistance = 99999;
    let shortestId = -1;

    const shortestPathCoordinates = () => latLngArrayMap(shortestPath);
    if(shortestPath.length > 1) polylineSearch.push([ shortestPathCoordinates() ]);

    markers.find(marker => marker.id === lastID()).distances
    .forEach(distance => {
      if(!shortestPath.find(path => distance.id === path.id)){
        const marker = markers.find(marker => marker.id === distance.id);
        polylineSearch.push([
          shortestPathCoordinates(),
          [ ...shortestPathCoordinates(), { lat: marker.lat, lng: marker.lng } ],
        ]);

        if(shortestDistance > distance.distance){
          shortestDistance = distance.distance;
          shortestId = distance.id
        }
      }
    });
    shortestPath.push(markers.find(marker => marker.id === shortestId));
  }
  console.log(calcPathDistance(shortestPath).distance);
  return { shortestPath, polylineSearch };
}

// Give all possible variations from array, code example from:
// https://www.reddit.com/r/javascript/comments/5k270h/all_possible_routes_traveling_salesman_problem_in/
const generatePermutations = (Arr) => {
  const permutations = [];
  const A = Arr.slice();

  const swap = (a,b) => {
    const tmp = A[a];
    A[a] = A[b];
    A[b] = tmp;
  }

  const generate = (n, A) => {
    if (n == 1){
      permutations.push(A.slice());
    } else {
      for(let i = 0; i <= n-1; i++) {
        generate(n-1, A);
        swap(n % 2 == 0 ? i : 0 ,n-1);
      }
    }
  }

  generate(A.length, A);

  return permutations;
}

const bruteForce = (markers) => {
  const permutations = generatePermutations( markers.slice(1) );
  let bestDistance = 99999;
  let shortestPath = [];
  const polylineSearch = []

  permutations.forEach( perm => {
    perm.unshift(markers[0]);
    polylineSearch.push([
      latLngArrayMap(perm)
    ]);

    const distance = calcPathDistance(perm).distance;
    if(bestDistance > distance){
      bestDistance = distance;
      shortestPath = perm;
    }
  });
  polylineSearch.push([latLngArrayMap(shortestPath)]);

  return { bestDistance, shortestPath, polylineSearch }
}

export { shortestPath, bruteForce }