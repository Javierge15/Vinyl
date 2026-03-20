import { useState, useEffect } from 'react'

function App() {
  const [discos, setDiscos] = useState([])
  
  // Estados del formulario
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [rating, setRating] = useState(10)
  const [review, setReview] = useState('')

  // Estados del buscador
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])
  const [caratulaSeleccionada, setCaratulaSeleccionada] = useState(null)

  // --- 1. CARGAR DISCOS (GET) ---
  const cargarDiscos = () => {
    fetch('http://127.0.0.1:8000/logs')
      .then(respuesta => respuesta.json())
      .then(datos => setDiscos(datos))
      .catch(error => console.error("Error al cargar:", error))
  }

  useEffect(() => {
    cargarDiscos()
  }, [])

  // --- 2. BUSCAR EN ITUNES ---
  const buscarEnInternet = async (e) => {
    e.preventDefault()
    if (!terminoBusqueda) return
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(terminoBusqueda)}&entity=album&limit=4`
      const respuesta = await fetch(url)
      const datos = await respuesta.json()
      setResultadosBusqueda(datos.results)
    } catch (error) {
      console.error("Error buscando el álbum:", error)
    }
  }

  const seleccionarAlbumReal = (album) => {
    setTitle(album.collectionName)
    setArtist(album.artistName)
    // Pedimos imagen de alta calidad (600x600 es mejor para vallas publicitarias, 300x300 está bien aquí)
    setCaratulaSeleccionada(album.artworkUrl100.replace('100x100bb', '400x400bb'))
    setResultadosBusqueda([])
    setTerminoBusqueda('')
  }

  // --- 3. GUARDAR DISCO (POST) ---
  const guardarDisco = async (e) => {
    e.preventDefault()
    
    // Empaquetamos los datos asegurando que cover_url lleva la imagen seleccionada
    const nuevoDisco = { 
      title, 
      artist, 
      rating, 
      review,
      cover_url: caratulaSeleccionada // ¡Aquí está la clave!
    }

    try {
      const respuesta = await fetch('http://127.0.0.1:8000/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoDisco)
      })

      if (respuesta.ok) {
        setTitle('')
        setArtist('')
        setRating(10)
        setReview('')
        setCaratulaSeleccionada(null)
        cargarDiscos() // Recargamos la lista
      }
    } catch (error) {
      console.error("Error al guardar el disco:", error)
    }
  }

  // --- 4. BORRAR DISCO (DELETE) - ¡NUEVO! ---
  const borrarDisco = async (id) => {
    if(!window.confirm("¿Estás seguro de que quieres borrar este disco?")) return;

    try {
      const respuesta = await fetch(`http://127.0.0.1:8000/logs/${id}`, {
        method: 'DELETE'
      })

      if (respuesta.ok) {
        cargarDiscos() // Recargamos la lista instantáneamente
      } else {
        alert("No se pudo borrar el disco.")
      }
    } catch (error) {
      console.error("Error al borrar:", error)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui', maxWidth: '700px', margin: '0 auto', color: '#333' }}>
      <h1 style={{ textAlign: 'center' }}>🎵 Mi Colección de Vinilos</h1>
      
      {/* BUSCADOR */}
      <div style={{ backgroundColor: '#e2e8f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0, fontSize: '16px' }}>🔍 Buscar disco en internet</h3>
        <form onSubmit={buscarEnInternet} style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="Ej: Random Access Memories..." value={terminoBusqueda} onChange={(e) => setTerminoBusqueda(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
          <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#475569', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Buscar</button>
        </form>
        {resultadosBusqueda.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
            {resultadosBusqueda.map(album => (
              <div key={album.collectionId} onClick={() => seleccionarAlbumReal(album)} style={{ backgroundColor: 'white', padding: '10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #cbd5e1' }}>
                <img src={album.artworkUrl100} alt="Portada" style={{ width: '50px', height: '50px', borderRadius: '4px' }} />
                <div style={{ fontSize: '12px' }}><strong>{album.collectionName}</strong><br/>{album.artistName}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FORMULARIO */}
      <div style={{ backgroundColor: '#e9ecef', padding: '20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        {caratulaSeleccionada && (
          <img src={caratulaSeleccionada} alt="Portada seleccionada" style={{ width: '120px', height: '120px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
        )}
        <form onSubmit={guardarDisco} style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <input type="text" placeholder="Título del álbum" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '8px' }}/>
          <input type="text" placeholder="Artista" value={artist} onChange={(e) => setArtist(e.target.value)} required style={{ padding: '8px' }}/>
          <input type="number" placeholder="Nota (0-10)" value={rating} onChange={(e) => setRating(Number(e.target.value))} min="0" max="10" required style={{ padding: '8px' }}/>
          <textarea placeholder="¿Qué te pareció?" value={review} onChange={(e) => setReview(e.target.value)} required style={{ padding: '8px' }}/>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar en mi Colección</button>
        </form>
      </div>

      {/* LISTA DE DISCOS CON BOTÓN DE BORRAR */}
      {discos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Tu colección está vacía. ¡Busca y añade tu primer disco arriba!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {discos.map(disco => (
            <div key={disco.id} style={{ display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid #eee', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              
              {disco.cover_url ? (
                <img src={disco.cover_url} alt="Portada" style={{ width: '80px', height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '11px' }}>Sin foto</div>
              )}
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{disco.title}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#666' }}>{disco.artist}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ backgroundColor: '#ffd700', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>⭐ {disco.rating}/10</span>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#555', fontSize: '14px' }}>"{disco.review}"</p>
                </div>
              </div>

              {/* --- BOTÓN DE BORRAR --- */}
              <button 
                onClick={() => borrarDisco(disco.id)}
                style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                Borrar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App